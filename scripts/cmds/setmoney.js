const moment = require("moment-timezone");

const ADMINS = [
    61590677925905,
    100076392843792
];

module.exports = {
    config: {
        name: "setmoney",
        aliases: ["setbal", "addmoney", "givemoney"],
        version: "1.8",
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

            if (!ADMINS.includes(userId)) {
                return message.reply("🔒 | APENAS ADMINS!");
            }

            if (args.length < 2) {
                return message.reply(`❌ | !setmoney 1000 @user OU !setmoney 1000 61590677925905`);
            }

            let amount = 0;
            let targetId = null;
            let targetName = "";

            if (Object.keys(mentions).length > 0) {
                targetId = parseInt(Object.keys(mentions)[0]);
                targetName = mentions[targetId].replace(/@/g, '').trim();
                amount = parseInt(args[0]);
            } else if (!isNaN(args[0]) && args.length >= 2) {
                amount = parseInt(args[0]);
                targetId = parseInt(args[1]);
            } else {
                return message.reply(`❌ | MARQUE ALGUÉM OU COLOQUE O ID!`);
            }

            if (isNaN(amount) || amount < 0 || !targetId || targetId < 1000000000) {
                return message.reply(`❌ | VALOR OU ID INVÁLIDO!`);
            }

            // 🔥 SOLUÇÃO DEFINITIVA: Usa set() que CRIA automaticamente
            await usersData.set(targetId, {
                money: amount,
                exp: 0,
                name: targetName || `User_${targetId}`,
                data: {
                    slot_wins: 0,
                    slot_losses: 0,
                    slot_biggest_win: 0,
                    slot_last_play: 0,
                    work_count: 0,
                    work_last_reset: 0
                }
            });

            // 🔥 Verifica se salvou
            const check = await usersData.get(targetId);
            const savedMoney = check?.money || 0;

            return message.reply(
`🔧 | SALDO DEFINIDO!
👤 **${targetName || check?.name || targetId}**
💰 ${savedMoney}$`
            );

        } catch (error) {
            console.error('Erro no setmoney:', error);
            return message.reply(`❌ | ERRO: ${error.message}`);
        }
    }
};
