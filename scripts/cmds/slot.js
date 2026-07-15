const fs = require('fs');
const path = require('path');

// Caminho do arquivo de dados
const DATA_FILE = path.join(__dirname, 'slot_data.json');

// 🔥 FUNÇÕES PRA MANIPULAR O JSON
const loadData = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.log('Erro ao ler dados, criando novo arquivo');
    }
    // Dados padrão
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
    } catch (e) {
        console.error('Erro ao salvar dados:', e);
        return false;
    }
};

// 🔥 FUNÇÃO PRA GARANTIR QUE O USUÁRIO EXISTE
const ensureUser = (data, userId) => {
    if (!data.users[userId]) {
        data.users[userId] = {
            money: 10000,
            slot_wins: 0,
            slot_losses: 0,
            slot_total_bet: 0,
            slot_biggest_win: 0,
            name: `User_${userId}`
        };
        saveData(data);
    }
    return data;
};

module.exports = {
    config: {
        name: "slot",
        aliases: ["caçaniqueis", "roleta"],
        version: "2.3",
        author: "SeuNome",
        countDown: 5,
        role: 0,
        description: {
            pt: "Jogue na máquina caça-níqueis e ganhe dinheiro!"
        },
        category: "economy",
        guide: {
            pt: "   {pn} [valor]: Aposte um valor para jogar\n   {pn} ranking: Veja o ranking dos maiores ganhadores\n   {pn} reset: Reseta todos os dados (adm apenas)"
        }
    },

    onStart: async function ({ message, usersData, event, args }) {
        const { senderID } = event;
        const userId = parseInt(senderID);
        const command = args[0]?.toLowerCase();

        // Carrega os dados
        let data = loadData();

        // Comando de ranking
        if (command === "ranking" || command === "rank") {
            return await this.showRanking({ message, data });
        }

        // Comando de reset (apenas admin)
        if (command === "reset") {
            // Verifica se é admin (opcional)
            const isAdmin = false; // Coloca lógica de admin aqui
            if (!isAdmin) {
                return message.reply("❌ | Apenas administradores podem resetar!");
            }
            
            // Reseta tudo
            fs.writeFileSync(DATA_FILE, JSON.stringify({
                users: {},
                global: {
                    jackpot: 0,
                    total_bets: 0,
                    total_payouts: 0
                }
            }, null, 2));
            return message.reply("🔄 | Todos os dados foram resetados!");
        }

        // Verifica aposta
        const betAmount = parseInt(args[0]);
        if (!betAmount || betAmount <= 0) {
            return message.reply("🎰 | Aposte um valor válido! Ex: !slot 1000\n📊 | Ou use !slot ranking");
        }

        // Garante que o usuário existe
        data = ensureUser(data, userId);

        const userData = data.users[userId];
        const userMoney = userData.money || 10000;

        if (betAmount > userMoney) {
            return message.reply(`❌ | Você só tem ${userMoney}$, aposta menor!`);
        }

        // Dados globais
        let jackpot = data.global.jackpot || 0;
        let totalBets = data.global.total_bets || 0;
        let totalPayouts = data.global.total_payouts || 0;

        // Símbolos do caça-níquel
        const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣", "⭐", "🎰"];
        const result = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        let winMultiplier = 0;
        let winType = "";

        // Verifica combinações
        if (result[0] === result[1] && result[1] === result[2]) {
            if (result[0] === "💎") {
                winMultiplier = 15;
                winType = "💎 JACKPOT!";
            } else if (result[0] === "7️⃣") {
                winMultiplier = 8;
                winType = "🎰 SETE DA SORTE!";
            } else if (result[0] === "⭐") {
                winMultiplier = 5;
                winType = "⭐ ESTRELA DA FORTUNA!";
            } else if (result[0] === "🎰") {
                winMultiplier = 3;
                winType = "🎰 CAÇA-NÍQUEIS!";
            } else {
                winMultiplier = 2.5;
                winType = "🍀 TRIPLO!";
            }
        } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
            winMultiplier = 1.5;
            winType = "👍 DUPLO!";
        }

        // 5% de chance de ativar o jackpot progressivo
        const jackpotChance = Math.random() < 0.05;
        let jackpotWon = 0;

        let finalMessage = `🎰 | ${result.join(" | ")} 🎰\n\n`;
        let newMoney = userMoney;
        let winnings = 0;

        if (winMultiplier > 0) {
            winnings = Math.floor(betAmount * winMultiplier);
            
            if (jackpotChance && jackpot > 0) {
                jackpotWon = Math.floor(jackpot * 0.3);
                winnings += jackpotWon;
                winType = "🎰 **JACKPOT PROGRESSIVO!** 🎰";
                jackpot = Math.floor(jackpot * 0.7);
            }

            newMoney = userMoney - betAmount + winnings;
            
            userData.slot_wins = (userData.slot_wins || 0) + 1;
            userData.slot_total_bet = (userData.slot_total_bet || 0) + betAmount;
            
            if (winnings > (userData.slot_biggest_win || 0)) {
                userData.slot_biggest_win = winnings;
            }

            totalPayouts += winnings;

            finalMessage += `🎉 **${winType}** 🎉\n`;
            finalMessage += `💰 Prêmio: ${winnings}$ (x${winMultiplier})\n`;
            if (jackpotWon > 0) {
                finalMessage += `🎰 Jackpot: +${jackpotWon}$\n`;
            }
            finalMessage += `💵 Novo saldo: ${newMoney}$`;

        } else {
            const jackpotContribution = Math.floor(betAmount * 0.02);
            jackpot += jackpotContribution;
            newMoney = userMoney - betAmount;
            
            userData.slot_losses = (userData.slot_losses || 0) + 1;
            userData.slot_total_bet = (userData.slot_total_bet || 0) + betAmount;

            finalMessage += `😢 **PERDEU!**\n`;
            finalMessage += `💸 Perdeu: ${betAmount}$\n`;
            finalMessage += `🎰 Jackpot aumentou em +${jackpotContribution}$\n`;
            finalMessage += `💵 Novo saldo: ${newMoney}$`;
        }

        // Atualiza dados
        userData.money = newMoney;
        data.global.jackpot = jackpot;
        data.global.total_bets = totalBets + 1;
        data.global.total_payouts = totalPayouts;

        // 🔥 SALVA OS DADOS NO ARQUIVO
        saveData(data);

        finalMessage += `\n\n🎰 **Jackpot Atual:** ${jackpot}$`;

        return message.reply(finalMessage);
    },

    showRanking: async function ({ message, data }) {
        const users = data.users;
        const userIds = Object.keys(users);
        
        // Filtra jogadores
        const players = userIds.filter(id => 
            (users[id].slot_wins > 0 || users[id].slot_losses > 0)
        ).map(id => ({
            ...users[id],
            userId: id
        }));

        if (players.length === 0) {
            return message.reply("📊 | Ninguém jogou ainda! Seja o primeiro!");
        }

        // Ordena por maior ganho
        const sorted = players.sort((a, b) => 
            (b.slot_biggest_win || 0) - (a.slot_biggest_win || 0)
        );

        const top10 = sorted.slice(0, 10);

        let rankingMessage = "🏆 **RANKING DOS MAIORES GANHADORES** 🏆\n\n";

        top10.forEach((player, index) => {
            const name = player.name || `User ${player.userId}`;
            const wins = player.slot_wins || 0;
            const biggestWin = player.slot_biggest_win || 0;
            const totalBet = player.slot_total_bet || 0;
            
            let medal = "";
            if (index === 0) medal = "🥇 ";
            else if (index === 1) medal = "🥈 ";
            else if (index === 2) medal = "🥉 ";
            else medal = `${index + 1}. `;

            rankingMessage += `${medal} **${name}**\n`;
            rankingMessage += `   💰 Maior prêmio: ${biggestWin}$\n`;
            rankingMessage += `   🎯 Vitórias: ${wins} | Apostado: ${totalBet}$\n\n`;
        });

        const jackpot = data.global.jackpot || 0;
        const totalBets = data.global.total_bets || 0;
        const totalPayouts = data.global.total_payouts || 0;

        rankingMessage += `📊 **ESTATÍSTICAS GLOBAIS**\n`;
        rankingMessage += `🎰 Jackpot: ${jackpot}$\n`;
        rankingMessage += `🎲 Total de rodadas: ${totalBets}\n`;
        rankingMessage += `💰 Total pago: ${totalPayouts}$\n`;
        rankingMessage += `📈 Total de jogadores: ${players.length}`;

        return message.reply(rankingMessage);
    }
};
