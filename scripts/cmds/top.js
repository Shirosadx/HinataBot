const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'slot_data.json');

const loadData = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {}
    return { users: {}, global: { jackpot: 0, total_bets: 0, total_payouts: 0 } };
};

module.exports = {
    config: {
        name: "top",
        aliases: ["ranking", "maisricos"],
        version: "1.1",
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
        const data = loadData();
        const users = data.users;
        const userIds = Object.keys(users);
        
        // 🔥 PEGA OS NOMES DO usersData E ATUALIZA NO JSON
        const players = [];
        
        for (const id of userIds) {
            if (users[id].money > 0) {
                let name = users[id].name || `User_${id}`;
                
                // 🔥 TENTA PEGAR O NOME DO usersData (mais atualizado)
                try {
                    const userInfo = await usersData.get(parseInt(id));
                    if (userInfo && userInfo.name) {
                        name = userInfo.name;
                        // Atualiza no JSON
                        users[id].name = name;
                    }
                } catch (e) {}
                
                players.push({
                    userId: id,
                    money: users[id].money || 0,
                    name: name
                });
            }
        }

        // Salva os nomes atualizados
        const fs = require('fs');
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        } catch (e) {}

        if (players.length === 0) {
            return message.reply("📊 | NINGUÉM TEM DINHEIRO AINDA!");
        }

        // Ordena por dinheiro
        const sorted = players.sort((a, b) => b.money - a.money);
        const top10 = sorted.slice(0, 10);

        let msg = "🏆 **MAIS RICOS** 🏆\n\n";
        
        top10.forEach((user, index) => {
            let medal = "";
            if (index === 0) medal = "🥇 ";
            else if (index === 1) medal = "🥈 ";
            else if (index === 2) medal = "🥉 ";
            else medal = `${index + 1}. `;
            
            msg += `${medal} **${user.name}**\n`;
            msg += `   💰 ${user.money}$\n\n`;
        });

        // Estatísticas
        const totalMoney = players.reduce((acc, p) => acc + p.money, 0);
        const totalPlayers = players.length;
        
        msg += `📊 **TOTAL:** ${totalMoney}$ | **JOGADORES:** ${totalPlayers}`;

        return message.reply(msg);
    }
};        
        const players = userIds
            .filter(id => users[id].money > 0)
            .map(id => ({
                userId: id,
                money: users[id].money || 0,
                name: users[id].name || `User_${id}`
            }))
            .sort((a, b) => b.money - a.money);

        if (players.length === 0) {
            return message.reply("📊 | NINGUÉM TEM DINHEIRO AINDA!");
        }

        const top10 = players.slice(0, 10);
        let msg = "🏆 **MAIS RICOS** 🏆\n\n";
        
        top10.forEach((user, index) => {
            let medal = "";
            if (index === 0) medal = "🥇 ";
            else if (index === 1) medal = "🥈 ";
            else if (index === 2) medal = "🥉 ";
            else medal = `${index + 1}. `;
            
            msg += `${medal} **${user.name}**\n`;
            msg += `   💰 ${user.money}$\n\n`;
        });

        const totalMoney = players.reduce((acc, p) => acc + p.money, 0);
        const totalPlayers = players.length;
        msg += `📊 **TOTAL:** ${totalMoney}$ | **JOGADORES:** ${totalPlayers}`;

        return message.reply(msg);
    }
};
