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

const ensureUser = (data, userId, name = '') => {
    if (!data.users[userId]) {
        data.users[userId] = {
            money: 0,
            name: name || `User_${userId}`,
            slot_wins: 0,
            slot_losses: 0,
            slot_total_bet: 0,
            slot_biggest_win: 0,
            slot_last_play: 0
        };
        saveData(data);
    } else if (name && !data.users[userId].name) {
        // Se não tiver nome, atualiza
        data.users[userId].name = name;
        saveData(data);
    }
    return data;
};

// 🔥 LISTA DE ADMINS
const ADMINS = [
    61590677925905, // Seu ID
    // 123456789, // Outro admin
];

module.exports = {
    config: {
        name: "setmoney",
        aliases: ["setbal", "addmoney", "givemoney"],
        version: "1.1",
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

    onStart: async function ({ message, event, args, usersData }) {
        const { senderID, mentions } = event;
        const userId = parseInt(senderID);

        // 🔥 VERIFICA SE É ADMIN
        if (!ADMINS.includes(userId)) {
            return message.reply("❌ | APENAS ADMINS PODEM USAR!");
        }

        if (args.length < 2) {
            return message.reply(`❌ | USE: !setmoney 1000 @user\nOU: !setmoney add 1000 @user\nOU: !setmoney remove 500 @user`);
        }

        const command = args[0]?.toLowerCase();
        let amount = parseInt(args[1]);
        let targetId = null;
        let targetName = "";

        // 🔥 PEGA O ALVO (menção ou ID)
        if (Object.keys(mentions).length > 0) {
            // TEM MENÇÃO
            targetId = parseInt(Object.keys(mentions)[0]);
            targetName = mentions[targetId].replace(/@/g, '').trim();
            
            // Se o comando for "add" ou "remove", o amount pode estar no args[2]
            if (command === "add" || command === "+" || command === "remove" || command === "-" || command === "sub") {
                if (args.length > 2) {
                    amount = parseInt(args[1]);
                } else {
                    return message.reply(`❌ | VALOR INVÁLIDO!`);
                }
            }
        } else if (!isNaN(args[1]) && args.length >= 2) {
            // É UM ID (número)
            targetId = parseInt(args[1]);
            // Se tiver args[2] e for número, é o valor (caso do add/remove)
            if (command === "add" || command === "+" || command === "remove" || command === "-" || command === "sub") {
                if (args.length > 2 && !isNaN(args[2])) {
                    amount = parseInt(args[2]);
                }
            }
        } else {
            return message.reply(`❌ | MARQUE ALGUÉM OU COLOQUE O ID!\nEx: !setmoney 1000 @joao\nOU: !setmoney 1000 61590677925905`);
        }

        if (!targetId) {
            return message.reply(`❌ | USUÁRIO NÃO ENCONTRADO!`);
        }

        if (!amount || amount < 0) {
            return message.reply(`❌ | VALOR INVÁLIDO! Use números positivos.`);
        }

        // 🔥 BUSCA O NOME DO USUÁRIO PELO ID
        try {
            const userInfo = await usersData.get(targetId);
            if (userInfo && userInfo.name) {
                targetName = userInfo.name;
            }
        } catch (e) {
            console.log('Erro ao buscar nome:', e);
        }

        // Se ainda não tem nome, tenta pegar do JSON
        let data = loadData();
        if (data.users[targetId] && data.users[targetId].name) {
            targetName = data.users[targetId].name;
        }

        // Se não tem nome, coloca "User_ID"
        if (!targetName) {
            targetName = `User_${targetId}`;
        }

        // Carrega dados
        data = loadData();
        data = ensureUser(data, targetId, targetName);

        const user = data.users[targetId];
        const currentMoney = user.money || 0;

        let responseMsg = "";

        // 🔥 COMANDOS
        if (command === "add" || command === "+") {
            // ADICIONA
            user.money = currentMoney + amount;
            saveData(data);
            responseMsg = `✅ | TRANSFERÊNCIA COMPLETA COM SUCESSO!\n👤 **${targetName}**\n💰 +${amount}$\n💵 Novo saldo: ${user.money}$`;
            
        } else if (command === "remove" || command === "-" || command === "sub") {
            // REMOVE
            const newAmount = Math.max(0, currentMoney - amount);
            user.money = newAmount;
            saveData(data);
            responseMsg = `❌ | REMOVIDO COM SUCESSO!\n👤 **${targetName}**\n💰 -${amount}$\n💵 Novo saldo: ${user.money}$`;
            
        } else {
            // SET (define exatamente o valor)
            user.money = amount;
            saveData(data);
            responseMsg = `🔧 | SALDO DEFINIDO COM SUCESSO!\n👤 **${targetName}**\n💰 Novo saldo: ${user.money}$`;
        }

        return message.reply(responseMsg);
    }
};
