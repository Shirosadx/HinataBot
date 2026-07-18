module.exports = {
    config: {
        name: "slot",
        version: "3.0",
        author: "Hinata",
        shortDescription: {
            en: "🎰 Slot machine game"
        },
        longDescription: {
            en: "Play slot machine and win/lose money!"
        },
        category: "Game",
        countDown: 5,
        role: 0
    },

    langs: {
        en: {
            invalid_amount: "❌ Enter a valid amount!",
            not_enough_money: "❌ Not enough money! You have: $%1",
            win_message: "🎉 You won $%1!\n┌─────┐\n│ %2 │\n├─────┤\n│ %3 │\n├─────┤\n│ %4 │\n└─────┘",
            lose_message: "💀 You lost $%1!\n┌─────┐\n│ %2 │\n├─────┤\n│ %3 │\n├─────┤\n│ %4 │\n└─────┘",
            jackpot_message: "🎰 **JACKPOT!** You won $%1!\n┌─────┐\n│ %2 │\n├─────┤\n│ %3 │\n├─────┤\n│ %4 │\n└─────┘",
        }
    },

    onStart: async function ({ api, event, args, usersData, getLang }) {
        try {
            const { senderID, threadID, messageID } = event;
            const amount = parseInt(args[0]);

            if (isNaN(amount) || amount <= 0) {
                return api.sendMessage(getLang("invalid_amount"), threadID, messageID);
            }

            // 🔥 BUSCA USUÁRIO
            let userData = await usersData.get(senderID);
            if (!userData) {
                await usersData.set(senderID, {
                    money: 0,
                    exp: 0,
                    name: `User_${senderID}`,
                    data: {}
                });
                userData = await usersData.get(senderID);
            }

            const money = userData.money || 0;

            if (amount > money) {
                return api.sendMessage(
                    getLang("not_enough_money").replace('%1', money),
                    threadID,
                    messageID
                );
            }

            // 🔥 SÍMBOLOS
            const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓', '🔔', '⭐', '🎰', '7️⃣', '💎', '👑'];
            
            // 🔥 SISTEMA DE PROBABILIDADE (EQUILIBRADO)
            // 35% de chance de perder
            // 65% de chance de ganhar algo
            const roll = Math.random();
            let slot1, slot2, slot3;
            let forcedResult = null;

            if (roll < 0.35) {
                // 🔥 PERDEU (35%)
                // Gera 3 símbolos aleatórios que NÃO combinam
                const common = ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓'];
                slot1 = common[Math.floor(Math.random() * common.length)];
                slot2 = common[Math.floor(Math.random() * common.length)];
                slot3 = common[Math.floor(Math.random() * common.length)];
                // Garante que não tenha combinação
                while (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
                    slot3 = common[Math.floor(Math.random() * common.length)];
                }
                forcedResult = 'lose';
            } else if (roll < 0.70) {
                // 🔥 2 IGUAIS (35%)
                const common = ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓'];
                const pair = common[Math.floor(Math.random() * common.length)];
                const third = common[Math.floor(Math.random() * common.length)];
                slot1 = pair;
                slot2 = pair;
                slot3 = third;
                forcedResult = 'pair';
            } else if (roll < 0.90) {
                // 🔥 3 IGUAIS (20%)
                const common = ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓'];
                const triple = common[Math.floor(Math.random() * common.length)];
                slot1 = triple;
                slot2 = triple;
                slot3 = triple;
                forcedResult = 'triple';
            } else if (roll < 0.97) {
                // 🔥 SÍMBOLO RARO (7%)
                const rare = ['⭐', '🎰', '🔔', '💎'];
                const triple = rare[Math.floor(Math.random() * rare.length)];
                slot1 = triple;
                slot2 = triple;
                slot3 = triple;
                forcedResult = 'rare';
            } else if (roll < 0.995) {
                // 🔥 ULTRA RARO (2.5%)
                const ultra = ['7️⃣'];
                slot1 = ultra[0];
                slot2 = ultra[0];
                slot3 = ultra[0];
                forcedResult = 'ultra';
            } else {
                // 🔥 JACKPOT (0.5%)
                slot1 = '👑';
                slot2 = '👑';
                slot3 = '👑';
                forcedResult = 'jackpot';
            }

            // 🔥 CALCULA GANHOS BASEADO NO RESULTADO FORÇADO
            let winnings = 0;
            let resultType = 'lose';

            if (forcedResult === 'jackpot') {
                winnings = amount * 20;
                resultType = 'jackpot';
            } else if (forcedResult === 'ultra') {
                winnings = amount * 10;
                resultType = 'win';
            } else if (forcedResult === 'rare') {
                winnings = amount * 5;
                resultType = 'win';
            } else if (forcedResult === 'triple') {
                winnings = amount * 3;
                resultType = 'win';
            } else if (forcedResult === 'pair') {
                winnings = amount * 1.5;
                resultType = 'win';
            } else {
                winnings = -amount;
                resultType = 'lose';
            }

            // Arredonda winnings
            winnings = Math.floor(winnings);

            // 🔥 ATUALIZA SALDO
            const newMoney = money + winnings;
            await usersData.set(senderID, {
                money: newMoney,
                data: userData.data
            });

            // 🔥 MENSAGEM
            let msg = '';
            
            // 🔥 ANIMAÇÃO DOS SÍMBOLOS
            const slotDisplay = `┌─────┐\n│ ${slot1} │\n├─────┤\n│ ${slot2} │\n├─────┤\n│ ${slot3} │\n└─────┘`;

            if (resultType === 'jackpot') {
                msg = `🎰 **JACKPOT!** You won $${winnings}!\n${slotDisplay}`;
            } else if (resultType === 'win') {
                msg = `🎉 You won $${winnings}!\n${slotDisplay}`;
            } else {
                msg = `💀 You lost $${Math.abs(winnings)}!\n${slotDisplay}`;
            }

            // 🔥 SALDO ATUAL
            msg += `\n\n💰 Balance: $${newMoney}`;

            // 🔥 ESTATÍSTICAS
            const wins = userData.data?.slot_wins || 0;
            const losses = userData.data?.slot_losses || 0;
            
            if (winnings > 0) {
                await usersData.set(senderID, {
                    "data.slot_wins": wins + 1
                });
            } else {
                await usersData.set(senderID, {
                    "data.slot_losses": losses + 1
                });
            }

            return api.sendMessage(msg, threadID, messageID);

        } catch (error) {
            console.error('Erro no slot:', error);
            return api.sendMessage(
                '❌ | ERRO: ' + error.message,
                event.threadID,
                event.messageID
            );
        }
    }
};
