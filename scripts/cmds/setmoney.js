const moment = require("moment-timezone");

const ADMINS = [
    61590677925905, // Owner 1
    100076392843792 // Owner 2
];

module.exports = {
    config: {
        name: "setmoney",
        aliases: ["setbal", "addmoney", "givemoney"],
        version: "1.7",
        author: "SeuNome",
        countDown: 5,
        role: 0,
        description: {
            pt: "Defina o saldo de um usuário (apenas admins)"
        },
        category: "economy",
        guide: {
            pt: "   {pn} [valor] @tag: Define o saldo do usuário\n   {pn} [valor] [id]: Define o saldo pelo ID"
        }
    },

    onStart: async function ({ message, event, args, usersData }) {
        try {
            const { senderID, mentions } = event;
            const userId = parseInt(senderID);

            // Verifica admin
            if (!ADMINS.includes(userId)) {
                return message.reply("🔒 | APENAS ADMINS PODEM USAR!");
            }

            if (args.length < 2) {
                return message.reply(`❌ | USE: !setmoney 1000 @user\nOU: !setmoney 1000 61590677925905`);
            }

            let amount = 0;
            let targetId = null;
            let targetName = "";

            // Pega alvo e valor
            if (Object.keys(mentions).length > 0) {
                targetId = parseInt(Object.keys(mentions)[0]);
                targetName = mentions[targetId].replace(/@/g, '').trim();
                amount = parseInt(args[0]);
            } else if (!isNaN(args[0]) && args.length >= 2) {
                amount = parseInt(args[0]);
                targetId = parseInt(args[1]);
            } else {
                return message.reply(`❌ | MARQUE ALGUÉM OU COLOQUE O ID!\nEx: !setmoney 1000 @joao\nOU: !setmoney 1000 61590677925905`);
            }

            if (isNaN(amount) || amount < 0) {
                return message.reply(`❌ | VALOR INVÁLIDO! Use números positivos.`);
            }

            if (!targetId || targetId < 1000000000) {
                return message.reply(`❌ | ID INVÁLIDO!`);
            }

            // 🔥 CRIA OU BUSCA O USUÁRIO
            let userData = await usersData.get(targetId);
            if (!userData) {
                await usersData.set(targetId, {
                    money: 0,
                    exp: 0,
                    name: targetName || `User_${targetId}`,
                    data: {}
                });
                userData = await usersData.get(targetId);
            }

            // Pega nome atualizado
            if (userData && userData.name) {
                targetName = userData.name;
            }

            const currentMoney = userData.money || 0;

            // 🔥 DEFINE O SALDO
            await usersData.set(targetId, { money: amount });

            return message.reply(
`🔧 | SALDO DEFINIDO COM SUCESSO!
👤 **${targetName}**
💰 Antigo: ${currentMoney}$
💰 Novo: ${amount}$`
            );

        } catch (error) {
            console.error('Erro no setmoney:', error);
            return message.reply(`❌ | OPS! DEU RUIM NO SETMONEY!\n💬 ${error.message}`);
        }
    }
};
