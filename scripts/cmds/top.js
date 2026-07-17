module.exports = {
    config: {
        name: "top",
        aliases: ["ranking", "maisricos"],
        version: "1.2",
        author: "SeuNome",
        countDown: 5,
        role: 0,
        description: {
            pt: "Veja o ranking dos mais ricos"
        },
        category: "economy",
        guide: {
            pt: "   {pn}: Ranking dos mais ricos"
        }
    },

    onStart: async function ({ message, usersData }) {
        try {
            // 🔥 PEGA TODOS OS USUÁRIOS
            const allUsers = await usersData.getAll();
            
            // 🔥 FILTRA QUEM TEM DINHEIRO > 0
            const players = allUsers
                .filter(u => (u.money || 0) > 0)
                .map(u => ({
                    name: u.name || `User_${u.userID}`,
                    userId: u.userID,
                    money: u.money || 0
                }))
                .sort((a, b) => b.money - a.money);

            if (players.length === 0) {
                return message.reply("📊 | NINGUÉM TEM DINHEIRO AINDA!");
            }

            // 🔥 TOP 10
            const top10 = players.slice(0, 10);

            let msg = "🏆 **MAIS RICOS** 🏆\n\n";

            top10.forEach((player, index) => {
                let medal = "";
                if (index === 0) medal = "🥇 ";
                else if (index === 1) medal = "🥈 ";
                else if (index === 2) medal = "🥉 ";
                else medal = `${index + 1}. `;
                
                msg += `${medal} **${player.name}**\n`;
                msg += `   💰 ${player.money}$\n\n`;
            });

            // 🔥 ESTATÍSTICAS
            const totalMoney = players.reduce((acc, p) => acc + p.money, 0);
            const totalPlayers = players.length;
            
            msg += `📊 **TOTAL:** ${totalMoney}$ | **JOGADORES:** ${totalPlayers}`;

            return message.reply(msg);

        } catch (error) {
            console.error('Erro no top:', error);
            return message.reply(`❌ | ERRO AO CARREGAR RANKING!\n💬 ${error.message}`);
        }
    }
};
