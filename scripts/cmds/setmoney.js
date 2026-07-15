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

// 🔥 LISTA DE ADMINS (coloca os IDs aqui)
const ADMINS = [
    61590677925905, // Seu ID
    // 123456789, // Outro admin
];

module.exports = {
    config: {
        name: "setmoney",
        aliases: ["setbal", "addmoney", "givemoney"],
        version: "1.0",
        author: "SeuNome",
        countDown: 5,
        role: 0,
        description: {
            pt: "Defina o saldo de um usuário (apenas admins)"
        },
        category: "economy",
        guide: {
            pt: "   {pn} [valor] @tag: Define o saldo do usuário\n   {pn} [valor] [id]: Define o saldo pelo ID\n   {pn} add [valor] @tag: Adiciona dinheiro\n   {pn} remove [valor] @tag: Remove dinheiro"
        }
    },

    onStart: async function ({ message, event, args }) {
        const { senderID, mentions } = event;
        const userId = parseInt(senderID);

        // 🔥 VERIFICA SE É ADMIN
        if (!ADMINS.includes(userId)) {
            return message.reply("❌ | APENAS ADMINS PODEM USAR!");
        }

        const command = args[0]?.toLowerCase();
        const amount = parseInt(args[1]);
        let targetId = null;
        let targetName = "";

        // 🔥 PEGA O ALVO (menção ou ID)
        if (Object.keys(mentions).length > 0) {
            targetId = parseInt(Object.keys(mentions)[0]);
            targetName = mentions[targetId].replace(/@/g, '').trim();
        } else if (args[1] && !isNaN(args[1])) {
            targetId = parseInt(args[1]);
        } else {
            return message.reply(`❌ | USE: !setmoney 1000 @user\nOU: !setmoney 1000 61590677925905`);
        }

        if (!amount || amount < 0) {
            return message.reply(`❌ | VALOR INVÁLIDO! Use números positivos.`);
        }

        // Carrega dados
        let data = loadData();
        data = ensureUser(data, targetId);

        const user = data.users[targetId];
        const currentMoney = user.money || 0;

        // 🔥 COMANDOS
        if (command === "add" || command === "+") {
            // ADICIONA
            user.money = currentMoney + amount;
            saveData(data);
            return message.reply(`✅ | **+${amount}$** para **${targetName}**\n💰 Novo saldo: ${user.money}$`);
            
        } else if (command === "remove" || command === "-" || command === "sub") {
            // REMOVE
            const newAmount = Math.max(0, currentMoney - amount);
            user.money = newAmount;
            saveData(data);
            return message.reply(`❌ | **-${amount}$** de **${targetName}**\n💰 Novo saldo: ${user.money}$`);
            
        } else {
            // SET (define exatamente o valor)
            user.money = amount;
            saveData(data);
            return message.reply(`🔧 | Saldo de **${targetName}** definido para **${amount}$**`);
        }
    }
};
