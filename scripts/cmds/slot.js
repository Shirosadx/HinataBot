const fs = require('fs');
const path = require('path');

// 🔥 ARQUIVO DE DADOS
const DATA_FILE = path.join(__dirname, 'slot_data.json');

const loadData = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {}
    return {
        users: {},
        global: {
            jackpot: 0,
            total_bets: 0,
            total_payouts: 0
        }
    };
};

const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) { return false; }
};

const ensureUser = (data, userId) => {
    if (!data.users[userId]) {
        data.users[userId] = {
            money: 0,
            slot_wins: 0,
            slot_losses: 0,
            slot_total_bet: 0,
            slot_biggest_win: 0,
            slot_last_play: 0
        };
        saveData(data);
    }
    return data;
};

// 🔥 SÍMBOLOS DA MÁQUINA (mais variados)
const SYMBOLS = {
    COMMON: ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓', '🍑', '🥝'],
    RARE: ['⭐', '🎰', '🔔', '💎'],
    ULTRA_RARE: ['7️⃣', '👑']
};

// 🔥 FUNÇÃO QUE SIMULA A ROLAGEM DOS SÍMBOLOS
const spinReels = () => {
    const allSymbols = [...SYMBOLS.COMMON, ...SYMBOLS.RARE, ...SYMBOLS.ULTRA_RARE];
    return [
        allSymbols[Math.floor(Math.random() * allSymbols.length)],
        allSymbols[Math.floor(Math.random() * allSymbols.length)],
        allSymbols[Math.floor(Math.random() * allSymbols.length)]
    ];
};

// 🔥 FUNÇÃO QUE VERIFICA SE TEM COMBINAÇÃO VENCEDORA
const checkWin = (result) => {
    const [a, b, c] = result;
    
    // 3 IGUAIS
    if (a === b && b === c) {
        // ULTRA RARE
        if (a === '👑') return { multiplier: 25, type: '👑 JACKPOT ROYAL!' };
        if (a === '7️⃣') return { multiplier: 15, type: '7️⃣ SETE DA SORTE!' };
        // RARE
        if (a === '💎') return { multiplier: 10, type: '💎 DIAMANTE!' };
        if (a === '⭐') return { multiplier: 8, type: '⭐ ESTRELA!' };
        if (a === '🎰') return { multiplier: 6, type: '🎰 CAÇA-NÍQUEIS!' };
        if (a === '🔔') return { multiplier: 5, type: '�BE SINO!' };
        // COMMON
        return { multiplier: 3, type: `🍀 ${a} TRIPLO!` };
    }
    
    // 2 IGUAIS
    if (a === b || b === c || a === c) {
        return { multiplier: 1.5, type: '👍 DUPLO!' };
    }
    
    return { multiplier: 0, type: '💀 PERDEU!' };
};

module.exports = {
    config: {
        name: "slot",
        aliases: ["caçaniqueis", "roleta"],
        version: "3.2",
        author: "SeuNome",
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

    onStart: async function ({ message, event, args }) {
        const { senderID } = event;
        const userId = parseInt(senderID);
        const command = args[0]?.toLowerCase();

        let data = loadData();
        data = ensureUser(data, userId);

        // Ranking
        if (command === "ranking" || command === "rank") {
            return await this.showRanking({ message, data });
        }

        const betAmount = parseInt(args[0]);
        if (!betAmount || betAmount <= 0) {
            return message.reply(`🎰 | APOSTE UM VALOR!\nEx: !slot 1000`);
        }

        const user = data.users[userId];
        const userMoney = user.money || 0;

        // Cooldown 10s
        const now = Date.now();
        const lastPlay = user.slot_last_play || 0;
        const cooldownTime = 10000;
        
        if (now - lastPlay < cooldownTime) {
            const remaining = Math.ceil((cooldownTime - (now - lastPlay)) / 1000);
            return message.reply(`⏳ | ${remaining}s`); // Mensagem curta
        }

        if (betAmount > userMoney) {
            return message.reply(`❌ | SALDO: ${userMoney}$`);
        }

        // 🔥 ANIMAÇÃO - Atualiza as frutas várias vezes
        let slotMessage = `🎰 | 🔄 | 🔄 | 🔄 | 🎰\n⏳ Girando...`;
        
        // Envia mensagem inicial
        const sentMessage = await message.reply(slotMessage);

        // 🔥 SIMULA ROLAGEM (3 atualizações antes do resultado final)
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        
        for (let i = 0; i < 3; i++) {
            const fakeResult = spinReels();
            const fakeDisplay = `🎰 | ${fakeResult.join(' | ')} | 🎰\n⏳ Girando...`;
            
            try {
                await sentMessage.edit(fakeDisplay);
            } catch (e) {
                // Se não conseguir editar, manda nova mensagem
                await message.reply(fakeDisplay);
            }
            
            await sleep(500 + i * 200); // 500ms, 700ms, 900ms
        }

        // 🔥 RESULTADO FINAL
        const result = spinReels();
        const win = checkWin(result);
        
        let jackpot = data.global.jackpot || 0;
        let jackpotWon = 0;
        let newMoney = userMoney;
        let winnings = 0;

        // Verifica se o resultado tem algum símbolo ultra raro (chance de 5% de ganhar jackpot)
        const hasUltraRare = result.some(s => SYMBOLS.ULTRA_RARE.includes(s));
        const jackpotRoll = Math.random();

        // 🔥 DISPLAY FINAL
        let finalDisplay = `🎰 | ${result.join(' | ')} | 🎰\n\n`;

        if (win.multiplier > 0) {
            // ✅ GANHOU
            winnings = Math.floor(betAmount * win.multiplier);
            
            // Chance de 5% de ganhar o jackpot se tiver símbolo ultra raro
            if (jackpot > 0 && hasUltraRare && jackpotRoll < 0.05) {
                jackpotWon = Math.floor(jackpot * 0.4);
                winnings += jackpotWon;
                jackpot = Math.floor(jackpot * 0.6);
                finalDisplay += `🎰 **JACKPOT! +${jackpotWon}$** 🎰\n`;
            }
            
            newMoney = userMoney - betAmount + winnings;
            
            // Atualiza estatísticas
            user.slot_wins = (user.slot_wins || 0) + 1;
            user.slot_total_bet = (user.slot_total_bet || 0) + betAmount;
            
            if (winnings > (user.slot_biggest_win || 0)) {
                user.slot_biggest_win = winnings;
            }

            data.global.total_payouts = (data.global.total_payouts || 0) + winnings;

            finalDisplay += `✅ ${win.type}\n`;
            finalDisplay += `💰 +${winnings}$`;
            if (win.multiplier > 0) {
                finalDisplay += ` (x${win.multiplier})`;
            }
            finalDisplay += `\n💵 ${newMoney}$`;

        } else {
            // ❌ PERDEU
            const jackpotContribution = Math.floor(betAmount * 0.03);
            jackpot += jackpotContribution;
            newMoney = userMoney - betAmount;
            
            user.slot_losses = (user.slot_losses || 0) + 1;
            user.slot_total_bet = (user.slot_total_bet || 0) + betAmount;

            // Verifica se tem 2 símbolos iguais (quase ganhou)
            const hasPair = result[0] === result[1] || result[1] === result[2] || result[0] === result[2];
            
            finalDisplay += `❌ PERDEU!\n`;
            finalDisplay += `💸 -${betAmount}$`;
            if (hasPair && win.multiplier === 0) {
                finalDisplay += `\n😅 QUASE! Faltou 1`;
            }
            finalDisplay += `\n💵 ${newMoney}$`;
            finalDisplay += `\n🎰 Jackpot: +${jackpotContribution}$`;
        }

        // Atualiza dados
        user.money = newMoney;
        user.slot_last_play = now;
        data.global.jackpot = jackpot;
        data.global.total_bets = (data.global.total_bets || 0) + 1;
        
        saveData(data);

        // 🔥 MOSTRA O JACKPOT ATUAL (se tiver mais de 0)
        if (jackpot > 0) {
            finalDisplay += `\n\n🎰 **JACKPOT:** ${jackpot}$`;
        }

        // Atualiza a mensagem final
        try {
            await sentMessage.edit(finalDisplay);
        } catch (e) {
            await message.reply(finalDisplay);
        }
    },

    showRanking: async function ({ message, data }) {
        const users = data.users;
        const userIds = Object.keys(users);
        
        const players = userIds.filter(id => 
            (users[id].slot_wins > 0 || users[id].slot_losses > 0)
        ).map(id => ({
            ...users[id],
            userId: id
        }));

        if (players.length === 0) {
            return message.reply("📊 | NINGUÉM JOGOU AINDA!");
        }

        const sorted = players.sort((a, b) => 
            (b.slot_biggest_win || 0) - (a.slot_biggest_win || 0)
        );

        const top10 = sorted.slice(0, 10);

        let rankingMessage = "🏆 **RANKING** 🏆\n\n";

        top10.forEach((player, index) => {
            const name = player.name || `User ${player.userId}`;
            const biggestWin = player.slot_biggest_win || 0;
            
            let medal = "";
            if (index === 0) medal = "🥇 ";
            else if (index === 1) medal = "🥈 ";
            else if (index === 2) medal = "🥉 ";
            else medal = `${index + 1}. `;

            rankingMessage += `${medal} **${name}**\n`;
            rankingMessage += `   💰 ${biggestWin}$\n`;
        });

        const jackpot = data.global.jackpot || 0;
        rankingMessage += `\n🎰 **JACKPOT:** ${jackpot}$`;

        return message.reply(rankingMessage);
    }
};
