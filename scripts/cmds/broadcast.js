const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "broadcast",
        aliases: ["bc", "anunciar", "avisar"],
        version: "3.5",
        author: "Gersen",
        countDown: 10,
        role: 2,
        description: {
            pt: "Envie uma mensagem estilizada para TODOS os grupos (apenas admins)"
        },
        category: "admin",
        guide: {
            pt: "   {pn} [mensagem]: Envia para todos os grupos\n   {pn} -f [mensagem]: Força envio mesmo com poucos grupos"
        }
    },

    onStart: async function ({ api, event, args, message }) {
        try {
            const { senderID, threadID } = event;
            const userId = parseInt(senderID);

            // 🔥 LISTA DE ADMINS
            const ADMINS = [
                61590677925905, // Seu ID
            ];

            if (!ADMINS.includes(userId)) {
                return api.sendMessage("🔒 | APENAS ADMINS PODEM USAR!", threadID);
            }

            let force = false;
            let messageText = args.join(' ');

            if (args[0]?.toLowerCase() === "-f") {
                force = true;
                messageText = args.slice(1).join(' ');
            }

            if (!messageText || messageText.trim().length === 0) {
                return api.sendMessage(`❌ | DIGITE UMA MENSAGEM!\nEx: !bc Olá pessoal!`, threadID);
            }

            // 🔥 BUSCA TODOS OS GRUPOS
            let groupThreads = [];
            
            try {
                // 🔥 USA O getThreadList DO API (igual ao fakechat)
                const threadList = await api.getThreadList(100, null, ['INBOX']);
                groupThreads = threadList.filter(thread => thread.isGroup === true);
            } catch (e) {
                console.log('Erro ao buscar grupos via api:', e);
                
                // 🔥 FALLBACK: USA O GRUPO ATUAL
                try {
                    const currentThread = await api.getThreadInfo(threadID);
                    if (currentThread && currentThread.isGroup) {
                        groupThreads = [{ threadID: threadID, name: currentThread.name || 'Grupo Atual' }];
                    }
                } catch (err) {
                    console.log('Erro ao buscar thread atual:', err);
                }
            }

            if (groupThreads.length === 0) {
                return api.sendMessage(`📢 | NENHUM GRUPO ENCONTRADO!\nO bot precisa estar em grupos para enviar broadcast.`, threadID);
            }

            if (groupThreads.length < 2 && !force) {
                return api.sendMessage(`⚠️ | APENAS ${groupThreads.length} GRUPO ENCONTRADO!\nUse !bc -f [mensagem] para forçar o envio.`, threadID);
            }

            // 🔥 NOME FIXO
            const adminName = "Gersen";

            // 🔥 CRIA A MENSAGEM ESTILIZADA
            const finalMessage = `🌸🍒ᏂᎥᏁᎪᏆᎪ ᏰᎧᏖ🍒🌸
       ╰╮✾╭╯╰╮✾╭╯
ᎧᎳᏁᎬᏒ/ᎠᎾᏁᎾ: ${adminName}
ᎷᏋᏁᏕᎪᎶᎬᎷ:♰${messageText}♰`;

            // 🔥 ENVIA PARA TODOS OS GRUPOS
            let successCount = 0;
            let failCount = 0;
            let errorDetails = [];

            // Mensagem de progresso
            const progressMsg = await api.sendMessage(`📤 | ENVIANDO BROADCAST...\n👥 ${groupThreads.length} grupos\n⏳ Aguarde...`, threadID);

            for (let i = 0; i < groupThreads.length; i++) {
                const group = groupThreads[i];
                const groupId = group.threadID;
                const groupName = group.name || `Grupo ${i + 1}`;
                
                try {
                    // 🔥 USA O sendMessage DO API (igual ao fakechat)
                    await api.sendMessage(finalMessage, groupId);
                    successCount++;
                    
                    // Atualiza progresso a cada 3 grupos
                    if (i % 3 === 0 && i > 0) {
                        try {
                            await api.editMessage(`📤 | ENVIANDO BROADCAST...\n✅ ${successCount}/${groupThreads.length} enviados\n⏳ Continuando...`, progressMsg.messageID);
                        } catch (e) {}
                    }

                } catch (error) {
                    failCount++;
                    errorDetails.push(`❌ ${groupName}: ${error.message}`);
                    console.error(`Erro ao enviar para grupo ${groupName}:`, error);
                }

                // 🔥 DELAY PARA NÃO SOBRECARREGAR
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // 🔥 MENSAGEM FINAL
            let finalMsg = `📢 **BROADCAST FINALIZADO!**\n\n`;
            finalMsg += `✅ Enviados: ${successCount}\n`;
            finalMsg += `❌ Falhas: ${failCount}\n`;
            finalMsg += `👥 Total: ${groupThreads.length}\n`;
            finalMsg += `📝 Mensagem: ${messageText}\n\n`;
            finalMsg += `🌸🍒 Template enviado!`;

            if (errorDetails.length > 0 && errorDetails.length <= 5) {
                finalMsg += `\n\n⚠️ ERROS:\n${errorDetails.join('\n')}`;
            } else if (errorDetails.length > 5) {
                finalMsg += `\n\n⚠️ ${errorDetails.length} erros ocorreram. Verifique os logs.`;
            }

            if (failCount === 0) {
                finalMsg += `\n\n✅ TUDO ENVIADO COM SUCESSO!`;
            }

            try {
                await api.editMessage(finalMsg, progressMsg.messageID);
            } catch (e) {
                await api.sendMessage(finalMsg, threadID);
            }

        } catch (error) {
            console.error('Erro no broadcast:', error);
            return api.sendMessage(`❌ | OPS! DEU RUIM NO BROADCAST!\n💬 ${error.message}`, event.threadID);
        }
    }
};
