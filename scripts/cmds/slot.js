module.exports = {
    config: {
        name: "slot",
        aliases: ["caçaniqueis", "roleta"],
        version: "3.5",
        author: "gerson",
        countDown: 5,
        role: 0,
        description: {
            pt: "Jogue na máquina caça-níqueis!"
        },
        category: "economy",
        guide: {
            pt: "   {pn} [valor]: Aposte um valor\n   {pn} ranking: Ranking dos maiores ganhadores"
        }
    },

    onStart: async function ({ message, event, args, usersData }) {
        try {
            const { senderID } = event;
            const userId = parseInt(senderID);
            const command = args[0]?.toLowerCase();

            // 🔥 CRIA O USUÁRIO SE NÃO EXISTIR
            let userData = await usersData.get(userId);
            if (!userData) {
                await usersData.set(userId, {
                    money: 0,
                    exp: 0,
                    name: `User_${userId}`,
                    data: {
                        slot_wins: 0,
                        slot_losses: 0,
                        slot_biggest_win: 0,
                        slot_last_play: 0,
                        work_count: 0,
                        work_last_reset: 0
                    }
                });
                userData = await usersData.get(userId);
            }

            if (!userData) {
                return message.reply("❌ | ERRO AO CRIAR USUÁRIO!");
            }

            // Ranking
            if (command === "ranking" || command === "rank") {
                return await this.showRanking({ message, usersData });
            }

            const betAmount = parseInt(args[0]);
            if (!betAmount || betAmount <= 0) {
                return message.reply(`🎰 | APOSTE UM VALOR!\nEx: !slot 1000`);
            }

            if (betAmount < 10) {
                return message.reply(`❌ | APOSTA MÍNIMA: 10$`);
            }

            // 🔥 PEGA DADOS
            let money = userData.money || 0;
            let slotWins = userData.data?.slot_wins || 0;
            let slotLosses = userData.data?.slot_losses || 0;
            let slotBiggestWin = userData.data?.slot_biggest_win || 0;
            let slotLastPlay = userData.data?.slot_last_play || 0;

            // Cooldown
            const now = Date.now();
            if (now - slotLastPlay < 10000) {
                const remaining = Math.ceil((10000 - (now - slotLastPlay)) / 1000);
                return message.reply(`⏳ | Aguarde **${remaining}s**!`);
            }

            if (betAmount > money) {
                return message.reply(`❌ | SALDO INSUFICIENTE!\n💰 Você tem: ${money}$`);
            }

            // Gira
            const result = spinReels();
            const win = checkWin(result);
            
            let newMoney = money;
            let msg = '';

            if (win.multiplier > 0) {
                const winnings = Math.floor(betAmount * win.multiplier);
                newMoney += winnings - betAmount;
                slotWins += 1;
                if (winnings > slotBiggestWin) slotBiggestWin = winnings;

                msg += `🎰 | ${result.join(' | ')} | 🎰\n\n`;
                msg += `✅ ${win.type}\n`;
                msg += `💰 +${winnings}$ (x${win.multiplier})\n`;
                msg += `💵 ${newMoney}$`;
            } else {
                newMoney -= betAmount;
                slotLosses += 1;

                const hasPair = result[0] === result[1] || result[1] === result[2] || result[0] === result[2];
                msg += `🎰 | ${result.join(' | ')} | 🎰\n\n`;
                msg += `❌ PERDEU!\n`;
                msg += `💸 -${betAmount}$`;
                if (hasPair) msg += `\n😅 QUASE! Faltou 1`;
                msg += `\n💵 ${newMoney}$`;
            }

            // 🔥 SALVA
            await usersData.set(userId, {
                money: newMoney,
                "data.slot_wins": slotWins,
                "data.slot_losses": slotLosses,
                "data.slot_biggest_win": slotBiggestWin,
                "data.slot_last_play": now
            });

            msg += `\n\n🎯 Vitórias: ${slotWins} | Derrotas: ${slotLosses}`;
            return message.reply(msg);

        } catch (error) {
            console.error('Erro no slot:', error);
            return message.reply(`❌ | ERRO: ${error.message}`);
        }
    },

    showRanking: async function ({ message, usersData }) {
        try {
            const allUsers = await usersData.getAll();
            
            const players = allUsers
                .filter(u => (u.data?.slot_wins || 0) > 0 || (u.data?.slot_losses || 0) > 0)
                .map(u => ({
                    name: u.name || `User_${u.userID}`,
                    biggestWin: u.data?.slot_biggest_win || 0,
                    wins: u.data?.slot_wins || 0,
                    losses: u.data?.slot_losses || 0
                }))
                .sort((a, b) => b.biggestWin - a.biggestWin);

            if (players.length === 0) {
                return message.reply("📊 | NINGUÉM JOGOU AINDA!");
            }

            const top10 = players.slice(0, 10);
            let msg = "🏆 **RANKING DO SLOT** 🏆\n\n";

            top10.forEach((player, index) => {
                const medal = ["🥇 ", "🥈 ", "🥉 "][index] || `${index + 1}. `;
                msg += `${medal} **${player.name}**\n`;
                msg += `   💰 Maior prêmio: ${player.biggestWin}$\n`;
                msg += `   🎯 ${player.wins}W | ${player.losses}L\n\n`;
            });

            return message.reply(msg);

        } catch (error) {
            console.error('Erro no ranking:', error);
            return message.reply(`❌ | ERRO: ${error.message}`);
        }
    }
};

// 🔥 SÍMBOLOS
const SYMBOLS = {
    COMMON: ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓', '🍑', '🥝'],
    RARE: ['⭐', '🎰', '🔔', '💎'],
    ULTRA_RARE: ['7️⃣', '👑']
};

const spinReels = () => {
    const allSymbols = [...SYMBOLS.COMMON, ...SYMBOLS.RARE, ...SYMBOLS.ULTRA_RARE];
    return [
        allSymbols[Math.floor(Math.random() * allSymbols.length)],
        allSymbols[Math.floor(Math.random() * allSymbols.length)],
        allSymbols[Math.floor(Math.random() * allSymbols.length)]
    ];
};

const checkWin = (result) => {
    const [a, b, c] = result;
    
    if (a === b && b === c) {
        if (a === '👑') return { multiplier: 25, type: '👑 JACKPOT ROYAL!' };
        if (a === '7️⃣') return { multiplier: 15, type: '7️⃣ SETE DA SORTE!' };
        if (a === '💎') return { multiplier: 10, type: '💎 DIAMANTE!' };
        if (a === '⭐') return { multiplier: 8, type: '⭐ ESTRELA!' };
        if (a === '🎰') return { multiplier: 6, type: '🎰 CAÇA-NÍQUEIS!' };
        if (a === '🔔') return { multiplier: 5, type: '🔔 SINO!' };
        return { multiplier: 3, type: `🍀 ${a} TRIPLO!` };
    }
    
    if (a === b || b === c || a === c) {
        return { multiplier: 1.5, type: '👍 DUPLO!' };
    }
    
    return { multiplier: 0, type: '💀 PERDEU!' };
};
