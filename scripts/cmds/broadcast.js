const fs = require("fs");
const path = require("path");

// 🔥 ARQUIVO ÚNICO PARA DADOS
const DATA_FILE = path.join(__dirname, 'broadcast_data.json');

// 🔥 FUNÇÕES DE MANIPULAÇÃO DE DADOS
const loadData = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {}
    return { groups: [] };
};

const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (e) { return false; }
};

// 🔥 ADICIONA GRUPO AUTOMATICAMENTE
const addGroup = (groupId, groupName) => {
    const data = loadData();
    const exists = data.groups.some(g => g.id === groupId);
    if (!exists) {
        data.groups.push({ id: groupId, name: groupName });
        saveData(data);
        return true;
    }
    return false;
};

module.exports = {
    config: {
        name: "broadcast",
        aliases: ["bc", "anunciar", "avisar"],
        version: "4.0",
        author: "Gerson",
        countDown: 10,
        role: 2,
        description: {
            pt: "Envia mensagem para TODOS os grupos que o bot está"
        },
        category: "admin",
        guide: {
            pt: "   {pn} [mensagem]: Envia para todos os grupos\n   {pn} list: Mostra grupos salvos\n   {pn} -f [mensagem]: Força envio"
        }
    },

    // 🔥 EVENTO: Quando o bot entra em um novo grupo
    onEvent: async function ({ api, event }) {
        try {
            if (event.logMessageType === "log:subscribe") {
                const { threadID } = event;
                const botID = api.getCurrentUserID();
                
                // Verifica se o bot foi adicionado
                if (event.logMessageData.addedParticipants) {
                    const added = event.logMessageData.addedParticipants.some(p => p.userFbId === botID);
                    if (added) {
                        const info = await api.getThreadInfo(threadID);
                        if (info && info.isGroup) {
                            const added = addGroup(threadID, info.name || 'Grupo sem nome');
                            if (added) {
                                console.log(`✅ Grupo adicionado automaticamente: ${info.name}`);
                            }
                        }
                    }
                }
            }
        } catch (e) {}
    },

    onStart: async function ({ api, event, args, message, usersData }) {
        try {
            const { senderID, threadID } = event;
            const userId = parseInt(senderID);
            const command = args[0]?.toLowerCase();

            const ADMINS = [61590677925905];
            if (!ADMINS.includes(userId)) {
                return message.reply("🔒 | APENAS ADMINS!");
            }

            // 🔥 CARREGA DADOS
            let data = loadData();
            
            // 🔥 ADICIONA O GRUPO ATUAL SE NÃO EXISTIR
            try {
                const info = await api.getThreadInfo(threadID);
                if (info && info.isGroup) {
                    const added = addGroup(threadID, info.name || 'Grupo sem nome');
                    if (added) {
                        data = loadData(); // Recarrega
                    }
                }
            } catch (e) {}

            // 🔥 COMANDO: LIST
            if (command === "list") {
                if (data.groups.length === 0) {
                    return message.reply("📋 | NENHUM GRUPO SALVO AINDA!");
                }
                let msg = `📋 **GRUPOS SALVOS**\n\n👥 Total: ${data.groups.length}\n\n`;
                data.groups.forEach((g, i) => {
                    msg += `${i + 1}. **${g.name}**\n   📌 ${g.id}\n\n`;
                });
                return message.reply(msg);
            }

            // 🔥 FORÇAR
            let force = false;
            let messageText = args.join(' ');

            if (args[0]?.toLowerCase() === "-f") {
                force = true;
                messageText = args.slice(1).join(' ');
            }

            if (!messageText || messageText.trim().length === 0) {
                return message.reply(`❌ | DIGITE UMA MENSAGEM!\nEx: !bc Olá pessoal!\n\n📋 Comandos:\n!bc list - Ver grupos\n!bc -f [msg] - Forçar envio`);
            }

            if (data.groups.length === 0) {
                return message.reply(`❌ | NENHUM GRUPO SALVO!\nO bot salva automaticamente quando entra em um grupo.`);
            }

            if (data.groups.length < 2 && !force) {
                return message.reply(`⚠️ | APENAS ${data.groups.length} GRUPO!\nUse !bc -f [mensagem] para forçar.`);
            }

            // 🔥 NOME DO ADMIN
            let adminName = "Gerson";
            try {
                const userInfo = await usersData.get(userId);
                if (userInfo && userInfo.name && userInfo.name !== "null") {
                    adminName = userInfo.name;
                }
            } catch (e) {}

            // 🔥 MENSAGEM ESTILIZADA
            const finalMessage = `🌸🍒ᏂᎥᏁᎪᏆᎪ ᏰᎧᏖ🍒🌸
       ╰╮✾╭╯╰╮✾╭╯
ᎧᎳᏁᎬᏒ/ᎠᎾᏁᎾ: ${adminName}
ᎷᏋᏁᏕᎪᎶᎬᎷ:♰${messageText}♰`;

            // 🔥 ENVIA
            const initialMsg = `📤 | INICIANDO...\n👥 ${data.groups.length} grupos\n⏳ 0/${data.groups.length}`;
            const sentMessage = await message.reply(initialMsg);

            let successCount = 0;
            let failCount = 0;
            let failedGroups = [];

            for (let i = 0; i < data.groups.length; i++) {
                const group = data.groups[i];
                
                try {
                    await api.sendMessage(finalMessage, group.id);
                    successCount++;
                } catch (error) {
                    failCount++;
                    failedGroups.push(group.name);
                }

                if (i % 2 === 0 || i === data.groups.length - 1) {
                    try {
                        const progress = `📤 | ENVIANDO...\n👥 ${data.groups.length} grupos\n✅ ${successCount}/${data.groups.length}\n⏳ ${Math.round((i + 1) / data.groups.length * 100)}%`;
                        await api.editMessage(progress, sentMessage.messageID);
                    } catch (e) {}
                }

                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // 🔥 FINAL
            let finalMsg = `📢 **BROADCAST FINALIZADO!**\n\n`;
            finalMsg += `✅ ${successCount} enviados\n`;
            finalMsg += `❌ ${failCount} falhas\n`;
            finalMsg += `👥 ${data.groups.length} total\n\n`;

            if (failedGroups.length > 0) {
                finalMsg += `⚠️ FALHAS:\n${failedGroups.map(g => `❌ ${g}`).join('\n')}\n\n`;
            }

            finalMsg += failCount === 0 ? `✅ TUDO OK!` : `⚠️ VERIFIQUE OS LOGS.`;

            try {
                await api.editMessage(finalMsg, sentMessage.messageID);
            } catch (e) {
                await message.reply(finalMsg);
            }

        } catch (error) {
            console.error('Erro:', error);
            return message.reply(`❌ | ERRO!\n💬 ${error.message}`);
        }
    }
};
