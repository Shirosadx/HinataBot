const fs = require('fs');
const path = require('path');

// 🔥 MESMO ARQUIVO DO SLOT
const DATA_FILE = path.join(__dirname, 'slot_data.json');

// Carrega os dados (igual ao slot)
const loadData = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {
        console.log('Erro ao ler dados, criando novo...');
    }
    return {
        users: {},
        global: {
            jackpot: 0,
            total_bets: 0,
            total_payouts: 0
        }
    };
};

// Salva os dados (igual ao slot)
const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error('Erro ao salvar dados:', e);
        return false;
    }
};

// 🔥 GARANTE QUE O USUÁRIO EXISTE
const ensureUser = (data, userId) => {
    if (!data.users[userId]) {
        data.users[userId] = {
            money: 0,
            slot_wins: 0,
            slot_losses: 0,
            slot_total_bet: 0,
            slot_biggest_win: 0
        };
        saveData(data);
    }
    return data;
};

module.exports = {
    config: {
        name: "balance",
        aliases: ["bal", "money", "carteira", "saldo"],
        version: "1.0",
        author: "SeuNome",
        countDown: 5,
        role: 0,
        description: {
            pt: "Veja seu saldo"
        },
        category: "economy",
        guide: {
            pt: "   {pn}: Ver seu saldo\n   {pn} @tag: Ver saldo de alguém"
        }
    },

    onStart: async function ({ message, event, args }) {
        const { senderID, mentions } = event;
        const userId = parseInt(senderID);

        // Carrega os dados
        let data = loadData();

        // 🔥 GARANTE QUE O USUÁRIO EXISTE
        data = ensureUser(data, userId);

        // 🔥 SE TIVER MENÇÃO, MOSTRA O SALDO DA PESSOA
        if (Object.keys(mentions).length > 0) {
            const targetId = Object.keys(mentions)[0];
            const targetIdInt = parseInt(targetId);
            const targetName = mentions[targetId].replace(/@/g, '').trim();

            // Garante que o alvo existe
            data = ensureUser(data, targetIdInt);

            const money = data.users[targetIdInt].money || 0;
            
            return message.reply(`💰 **${targetName}** tem **${money}$**`);
        }

        // 🔥 MOSTRA PRÓPRIO SALDO
        const money = data.users[userId].money || 0;

        return message.reply(`💰 **Seu saldo:** ${money}$`);
    }
};
