module.exports = {
    config: {
        name: "broadcast",
        aliases: ["bc", "anunciar", "avisar"],
        version: "3.2",
        author: "SeuNome",
        countDown: 10,
        role: 0,
        description: {
            pt: "Envie uma mensagem estilizada para TODOS os grupos (apenas admins)"
        },
        category: "admin",
        guide: {
            pt: "   {pn} [mensagem]: Envia para todos os grupos\n   {pn} -f [mensagem]: Força envio mesmo com poucos grupos"
        }
    },

    onStart: async function ({ message, event, args, usersData, global }) {
        try {
            const { senderID } = event;
            const userId = parseInt(senderID);
            const command = args[0]?.toLowerCase();

            // 🔥 LISTA DE ADMINS
            const ADMINS = [
                61590677925905, // Seu ID
            ];

            // 🔥 VERIFICA SE É ADMIN
            if (!ADMINS.includes(userId)) {
                return message.reply("🔒 | APENAS ADMINS PODEM USAR!");
            }

            // 🔥 FORÇAR ENVIO
            let force = false;
            let messageText = args.join(' ');

            if (args[0]?.toLowerCase() === "-f") {
                force = true;
                messageText = args.slice(1).join(' ');
            }

            if (!messageText || messageText.trim().length === 0) {
                return message.reply(`❌ | DIGITE UMA MENSAGEM!\nEx: !bc Olá pessoal!`);
            }

            // 🔥 BUSCA TODOS OS GRUPOS
            const allThreads = await global.getAllThreads();
            const groupThreads = allThreads.filter(thread => thread.isGroup === true);
            
            if (groupThreads.length === 0) {
                return message.reply(`📢 | O BOT NÃO ESTÁ EM NENHUM GRUPO!`);
            }

            if (groupThreads.length < 2 && !force) {
                return message.reply(`⚠️ | APENAS ${groupThreads.length} GRUPO ENCONTRADO!\nUse !bc -f [mensagem] para forçar o envio.`);
            }

            // 🔥 NOME FIXO DO ADMIN (SEM BUSCA, SEM ERRO!)
            const adminName = "Gerson"; // 🔥 COLOCA SEU NOME AQUI

            // 🔥 CRIA A MENSAGEM ESTILIZADA
            const finalMessage = `🌸🍒ᏂᎥᏁᎪᏆᎪ ᏰᎧᏖ🍒🌸
       ╰╮✾╭╯╰╮✾╭╯
ᎧᎳᏁᎬᏒ/ᎠᎾᏁᎾ: ${adminName}
ᎷᏋᏁᏕᎪᎶᎬᎷ:♰${messageText}♰`;

            // 🔥 ENVIA PARA TODOS OS GRUPOS
            let successCount = 0;
            let failCount = 0;
            let errorDetails = [];

            const progressMsg = await message.reply(`📤 | ENVIANDO BROADCAST...\n👥 ${groupThreads.length} grupos\n⏳ Aguarde...`);

            for (let i = 0; i < groupThreads.length; i++) {
                const group = groupThreads[i];
                
                try {
                    await message.send(finalMessage, group.threadID);
                    successCount++;
                    
                    if (i % 3 === 0 && i > 0) {
                        try {
                            await progressMsg.edit(`📤 | ENVIANDO BROADCAST...\n✅ ${successCount}/${groupThreads.length} enviados\n⏳ Continuando...`);
                        } catch (e) {}
                    }

                } catch (error) {
                    failCount++;
                    errorDetails.push(`❌ ${group.name || group.threadID}: ${error.message}`);
                }

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
                await progressMsg.edit(finalMsg);
            } catch (e) {
                await message.reply(finalMsg);
            }

        } catch (error) {
            console.error('Erro no broadcast:', error);
            return message.reply(`❌ | OPS! DEU RUIM NO BROADCAST!\n💬 ${error.message}`);
        }
    }
};
