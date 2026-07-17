const moment = require("moment-timezone");

const ADMINS = [61590677925905];

module.exports = {
    config: {
        name: "setmoney",
        aliases: ["setbal"],
        version: "1.0",
        author: "gerson",
        countDown: 5,
        role: 0,
        description: {
            pt: "Define o saldo de um usuário"
        },
        category: "admin",
        guide: {
            pt: "   {pn} [valor] @tag ou {pn} [valor] [id]"
        }
    },

    onStart: async function ({ message, event, args, usersData }) {
        try {
            const { senderID, mentions } = event;
            const userId = parseInt(senderID);

            // Verifica admin
            if (!ADMINS.includes(userId)) {
                return message.reply("🔒 | APENAS ADMINS, BURRO!");
            }

            // Pega ID e valor
            let targetId = null;
            let amount = 0;
            let targetName = "";

            if (Object.keys(mentions).length > 0) {
                targetId = parseInt(Object.keys(mentions)[0]);
                targetName = mentions[targetId].replace(/@/g, '').trim();
                amount = parseInt(args[0]);
            } else if (args.length >= 2) {
                amount = parseInt(args[0]);
                targetId = parseInt(args[1]);
            } else {
                return message.reply("❌ | !setmoney 1000 @user\nOU !setmoney 1000 61590677925905");
            }

            if (isNaN(amount) || amount < 0 || !targetId) {
                return message.reply("❌ | VALOR OU ID INVÁLIDO!");
            }

            // 🔥 SALVA DIRETO (já cria se não existir)
            await usersData.set(targetId, { money: amount });
            
            // Busca o nome
            try {
                const userInfo = await usersData.get(targetId);
                if (userInfo && userInfo.name) {
                    targetName = userInfo.name;
                }
            } catch (e) {}

            return message.reply(`✅ | SALDO DEFINIDO!\n👤 **${targetName}**\n💰 ${amount}$`);

        } catch (error) {
            console.error('Erro:', error);
            return message.reply(`❌ | ERRO: ${error.message}`);
        }
    }
};
