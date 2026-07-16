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
            slot_last_play: 0,
            work_count: 0,
            work_last_reset: 0
        };
        saveData(data);
    } else if (name && !data.users[userId].name) {
        data.users[userId].name = name;
        saveData(data);
    }
    return data;
};

// 🔥 LISTA DE ADMINS
const ADMINS = [
    61590677925905, // Seu ID
];

module.exports = {
    config: {
        name: "setmoney",
        aliases: ["setbal", "addmoney", "givemoney"],
        version: "1.3",
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
        try {
            const { senderID, mentions } = event;
            const userId = parseInt(senderID);

            // 🔥 VERIFICA SE É ADMIN
            if (!ADMINS.includes(userId)) {
                return message.reply("🔒 | APENAS ADMINS PODEM USAR!");
            }

            if (args.length < 2) {
                return message.reply(`❌ | USE: !setmoney 1000 @user\nOU: !setmoney 1000 61590677925905`);
            }

            // 🔥 IDENTIFICA O COMANDO
            const command = args[0]?.toLowerCase();
            let amount = 0;
            let targetId = null;
            let targetName = "";

            // 🔥 VERIFICA SE TEM MENÇÃO
            if (Object.keys(mentions).length > 0) {
                targetId = parseInt(Object.keys(mentions)[0]);
                targetName = mentions[targetId].replace(/@/g, '').trim();
                
                // 🔥 PEGA O VALOR
                if (command === "add" || command === "+" || command === "remove" || command === "-" || command === "sub") {
                    amount = parseInt(args[1]);
                    if (isNaN(amount) || amount < 0) {
                        return message.reply(`❌ | VALOR INVÁLIDO! Use números positivos.`);
                    }
                } else {
                    amount = parseInt(args[0]);
                    if (isNaN(amount) || amount < 0) {
                        return message.reply(`❌ | VALOR INVÁLIDO! Use números positivos.`);
                    }
                }
            } 
            // 🔥 VERIFICA SE É ID (número)
            else if (!isNaN(args[0]) && args.length >= 2) {
                const firstArg = parseInt(args[0]);
                const secondArg = parseInt(args[1]);
                
                if (secondArg > 1000000000) {
                    amount = firstArg;
                    targetId = secondArg;
                } else {
                    return message.reply(`❌ | ID INVÁLIDO! Use um ID válido do Facebook.`);
                }
            } 
            // 🔥 COMANDO ADD/REMOVE COM ID
            else if ((command === "add" || command === "+" || command === "remove" || command === "-" || command === "sub") && args.length >= 3) {
                amount = parseInt(args[1]);
                targetId = parseInt(args[2]);
                
                if (isNaN(amount) || amount < 0) {
                    return message.reply(`❌ | VALOR INVÁLIDO! Use números positivos.`);
                }
            } else {
                return message.reply(`❌ | MARQUE ALGUÉM OU COLOQUE O ID!\nEx: !setmoney 1000 @joao\nOU: !setmoney 1000 61590677925905`);
            }

            // 🔥 VALIDA O ID
            if (!targetId || targetId < 1000000000) {
                return message.reply(`❌ | ID INVÁLIDO! Use um ID válido do Facebook.`);
            }

            // 🔥 BUSCA O NOME DO USUÁRIO
            try {
                const userInfo = await usersData.get(targetId);
                if (userInfo && userInfo.name) {
                    targetName = userInfo.name;
                }
            } catch (e) {}

            // Carrega dados
            let data = loadData();
            data = ensureUser(data, targetId, targetName);

            const user = data.users[targetId];
            const currentMoney = user.money || 0;

            let responseMsg = "";

            // 🔥 EXECUTA O COMANDO
            if (command === "add" || command === "+") {
                user.money = currentMoney + amount;
                saveData(data);
                responseMsg = `✅ | TRANSFERÊNCIA COMPLETA!\n👤 **${targetName}**\n💰 +${amount}$\n💵 Novo saldo: ${user.money}$`;
                return message.reply(responseMsg);
                
            } else if (command === "remove" || command === "-" || command === "sub") {
                const newAmount = Math.max(0, currentMoney - amount);
                user.money = newAmount;
                saveData(data);
                responseMsg = `❌ | REMOVIDO!\n👤 **${targetName}**\n💰 -${amount}$\n💵 Novo saldo: ${user.money}$`;
                return message.reply(responseMsg);
                
            } else {
                user.money = amount;
                saveData(data);
                responseMsg = `🔧 | SALDO DEFINIDO!\n👤 **${targetName}**\n💰 Novo saldo: ${user.money}$`;
                return message.reply(responseMsg);
            }

        } catch (error) {
            console.error('Erro no setmoney:', error);
            return message.reply(`❌ | OPS! DEU RUIM NO SETMONEY!\n💬 ${error.message}`);
        }
    }
};
