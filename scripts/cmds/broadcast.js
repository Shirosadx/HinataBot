const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "savegroups",
        aliases: ["salvargrupos", "addgroups"],
        version: "1.0",
        author: "Gerson",
        countDown: 5,
        role: 2,
        description: {
            pt: "Salva todos os grupos que o bot está"
        },
        category: "admin",
        guide: {
            pt: "   {pn}: Salva os grupos\n   {pn} list: Mostra os grupos salvos"
        }
    },

    onStart: async function ({ api, event, args, message }) {
        try {
            const { threadID } = event;
            const command = args[0]?.toLowerCase();

            // 🔥 ARQUIVO ONDE VAI SALVAR
            const GROUPS_FILE = path.join(__dirname, 'groups_list.json');

            // 🔥 COMANDO LIST
            if (command === "list") {
                if (!fs.existsSync(GROUPS_FILE)) {
                    return message.reply("📋 | NENHUM GRUPO SALVO AINDA!");
                }

                const data = JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8'));
                let msg = `📋 **GRUPOS SALVOS**\n\n`;
                msg += `👥 Total: ${data.groups.length}\n\n`;
                
                data.groups.forEach((g, i) => {
                    msg += `${i + 1}. **${g.name}**\n`;
                    msg += `   📌 ID: ${g.id}\n`;
                });

                return message.reply(msg);
            }

            // 🔥 BUSCA TODOS OS GRUPOS
            let groups = [];
            
            try {
                // Tenta pegar via getThreadList
                const threadList = await api.getThreadList(500, null, ['INBOX']);
                groups = threadList.filter(thread => thread.isGroup === true);
            } catch (e) {
                console.log('Erro ao buscar grupos:', e);
            }

            // 🔥 SE NÃO ACHOU, USA O GRUPO ATUAL
            if (groups.length === 0) {
                try {
                    const currentThread = await api.getThreadInfo(threadID);
                    if (currentThread && currentThread.isGroup) {
                        groups = [{ 
                            threadID: threadID, 
                            name: currentThread.name || 'Grupo Atual' 
                        }];
                    }
                } catch (e) {}
            }

            if (groups.length === 0) {
                return message.reply("❌ | NENHUM GRUPO ENCONTRADO!");
            }

            // 🔥 SALVA OS GRUPOS
            const data = {
                savedAt: new Date().toISOString(),
                total: groups.length,
                groups: groups.map(g => ({
                    id: g.threadID,
                    name: g.name || 'Sem nome'
                }))
            };

            fs.writeFileSync(GROUPS_FILE, JSON.stringify(data, null, 2));

            return message.reply(`✅ | ${groups.length} GRUPOS SALVOS!\n📁 Arquivo: groups_list.json`);

        } catch (error) {
            console.error('Erro:', error);
            return message.reply(`❌ | ERRO AO SALVAR GRUPOS!\n💬 ${error.message}`);
        }
    }
};
