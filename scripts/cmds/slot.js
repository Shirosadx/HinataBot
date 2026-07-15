module.exports = {
    config: {
        name: "slot",
        aliases: ["caçaniqueis", "roleta"],
        version: "2.1",
        author: "Gerson",
        countDown: 5,
        role: 0,
        description: {
            pt: "Jogue na máquina caça-níqueis e ganhe dinheiro!"
        },
        category: "economy",
        guide: {
            pt: "   {pn} [valor]: Aposte um valor para jogar\n   {pn} ranking: Veja o ranking dos maiores ganhadores"
        }
    },

    onStart: async function ({ message, usersData, event, args, global }) {
        const { senderID } = event;
        //
        const userId = parseInt(senderID);
        const command = args[0]?.toLowerCase();

        //
        if (command === "ranking" || command === "rank") {
            return await this.showRanking({ message, usersData, global });
        }

        //
        const betAmount = parseInt(args[0]);
        if (!betAmount || betAmount <= 0) {
            return message.reply("🎰 | Aposte um valor válido! Ex: !slot 1000\n📊 | Ou use !slot ranking");
        }

        const userMoney = await usersData.get(userId, "money");
        const userWins = await usersData.get(userId, "slot_wins") || 0;
        const userLosses = await usersData.get(userId, "slot_losses") || 0;
        const userTotalBet = await usersData.get(userId, "slot_total_bet") || 0;
        const userBiggestWin = await usersData.get(userId, "slot_biggest_win") || 0;

        if (betAmount > userMoney) {
            return message.reply(`❌ | Você só tem ${userMoney}$, aposta menor!`);
        }

        //
        const GLOBAL_ID = 999999999; // ID fixo pra dados globais
        let jackpot = await usersData.get(GLOBAL_ID, "slot_jackpot") || 0;
        let totalBets = await usersData.get(GLOBAL_ID, "slot_total_bets") || 0;
        let totalPayouts = await usersData.get(GLOBAL_ID, "slot_total_payouts") || 0;

        //
        const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣", "⭐", "🎰"];
        const result = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        let winMultiplier = 0;
        let winType = "";

        //
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
            winType = "burlador yeah";
        }

        //
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
            
            await usersData.set(userId, "slot_wins", userWins + 1);
            await usersData.set(userId, "slot_total_bet", userTotalBet + betAmount);
            
            if (winnings > userBiggestWin) {
                await usersData.set(userId, "slot_biggest_win", winnings);
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
            
            await usersData.set(userId, "slot_losses", userLosses + 1);
            await usersData.set(userId, "slot_total_bet", userTotalBet + betAmount);

            finalMessage += `😢 **PERDEU!**\n`;
            finalMessage += `💸 Perdeu: ${betAmount}$\n`;
            finalMessage += `🎰 Jackpot aumentou em +${jackpotContribution}$\n`;
            finalMessage += `💵 Novo saldo: ${newMoney}$`;
        }

        // Atualiza dados
        totalBets += 1;
        await usersData.set(GLOBAL_ID, "slot_jackpot", jackpot);
        await usersData.set(GLOBAL_ID, "slot_total_bets", totalBets);
        await usersData.set(GLOBAL_ID, "slot_total_payouts", totalPayouts);

        await usersData.set(userId, "money", newMoney);

        finalMessage += `\n\n🎰 **Jackpot Atual:** ${jackpot}$`;

        return message.reply(finalMessage);
    },

    showRanking: async function ({ message, usersData }) {
        const allUsers = await usersData.getAll();
        
        const players = allUsers.filter(user => 
            (user.slot_wins > 0 || user.slot_losses > 0) && 
            user.userID !== 999999999 // Filtra o dado global
        );

        if (players.length === 0) {
            return message.reply("📊 | Ninguém jogou ainda! Seja o primeiro!");
        }

        const sorted = players.sort((a, b) => 
            (b.slot_biggest_win || 0) - (a.slot_biggest_win || 0)
        );

        const top10 = sorted.slice(0, 10);

        let rankingMessage = "🏆 **RANKING DOS MAIORES GANHADORES** 🏆\n\n";

        top10.forEach((player, index) => {
            const name = player.name || `User ${player.userID}`;
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

        const GLOBAL_ID = 999999999;
        const jackpot = await usersData.get(GLOBAL_ID, "slot_jackpot") || 0;
        const totalBets = await usersData.get(GLOBAL_ID, "slot_total_bets") || 0;
        const totalPayouts = await usersData.get(GLOBAL_ID, "slot_total_payouts") || 0;

        rankingMessage += `📊 **ESTATÍSTICAS GLOBAIS**\n`;
        rankingMessage += `🎰 Jackpot: ${jackpot}$\n`;
        rankingMessage += `🎲 Total de rodadas: ${totalBets}\n`;
        rankingMessage += `💰 Total pago: ${totalPayouts}$\n`;
        rankingMessage += `📈 Total de jogadores: ${players.length}`;

        return message.reply(rankingMessage);
    }
};
