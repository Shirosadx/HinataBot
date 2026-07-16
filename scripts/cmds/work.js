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
    } catch (e) {
        console.error('Erro ao carregar dados:', e);
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

const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error('Erro ao salvar dados:', e);
        return false;
    }
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

// 🔥 EVENTOS
const WORK_EVENTS = {
    positive: [
        { text: '💻 | Trabalhou como programador freelancer', min: 200, max: 800 },
        { text: '📚 | Deu aula particular de matemática', min: 150, max: 500 },
        { text: '🍕 | Entregou pizzas de moto', min: 100, max: 400 },
        { text: '🎨 | Vendeu uma arte digital', min: 300, max: 1000 },
        { text: '📝 | Fez um trabalho de faculdade', min: 250, max: 700 },
        { text: '🔧 | Consertou o PC de um cliente', min: 180, max: 600 },
        { text: '📦 | Trabalhou como entregador', min: 120, max: 450 },
        { text: '💪 | Foi personal trainer por um dia', min: 200, max: 550 },
        { text: '🎵 | Tocou em um bar e ganhou', min: 300, max: 900 },
        { text: '📸 | Fez um ensaio fotográfico', min: 250, max: 750 },
        { text: '🧹 | Fez faxina em uma casa', min: 150, max: 400 },
        { text: '🛠️ | Ajudou na construção', min: 200, max: 600 },
        { text: '🍔 | Trabalhou no McDonald\'s', min: 100, max: 350 },
        { text: '🎮 | Testou jogos como beta tester', min: 180, max: 500 },
        { text: '📊 | Fez planilhas para uma empresa', min: 220, max: 650 },
        { text: '✍️ | Escreveu artigos para um blog', min: 150, max: 450 },
        { text: '🎤 | Fez uma apresentação de stand-up', min: 300, max: 800 },
        { text: '🧑‍🍳 | Cozinhou para um evento', min: 200, max: 600 },
        { text: '🚗 | Fez Uber por um dia', min: 180, max: 550 },
        { text: '📦 | Trabalhou no estoque de uma loja', min: 150, max: 400 }
    ],
    negative: [
        { text: '😅 | Ensinou mal aos alunos da escola', min: 50, max: 200 },
        { text: '💸 | Perdeu a carteira com dinheiro', min: 100, max: 300 },
        { text: '🚗 | Bateu o carro e pagou o prejuízo', min: 200, max: 500 },
        { text: '📱 | Quebrou o celular do cliente', min: 150, max: 400 },
        { text: '🤦 | Fez um serviço errado e teve que refazer', min: 100, max: 250 },
        { text: '💀 | O cliente não pagou o serviço', min: 200, max: 600 },
        { text: '😤 | Levou um golpe num negócio', min: 300, max: 700 },
        { text: '🔧 | Comprou ferramenta nova e não funcionou', min: 150, max: 350 },
        { text: '📦 | Perdeu uma encomenda importante', min: 100, max: 300 },
        { text: '🤕 | Ficou doente e perdeu o dia de trabalho', min: 80, max: 200 },
        { text: '😡 | Cliente reclamou do serviço e pediu reembolso', min: 150, max: 400 },
        { text: '💔 | Foi demitido por justa causa', min: 300, max: 800 },
        { text: '🚫 | Tomou multa de trânsito', min: 150, max: 350 },
        { text: '📉 | Investimento deu errado', min: 200, max: 500 },
        { text: '😭 | Foi roubado no caminho do trabalho', min: 100, max: 250 }
    ]
};

const getRandomEvent = () => {
    const isPositive = Math.random() < 0.70;
    
    if (isPositive) {
        const event = WORK_EVENTS.positive[Math.floor(Math.random() * WORK_EVENTS.positive.length)];
        const amount = Math.floor(Math.random() * (event.max - event.min + 1)) + event.min;
        return { type: 'positive', text: event.text, amount };
    } else {
        const event = WORK_EVENTS.negative[Math.floor(Math.random() * WORK_EVENTS.negative.length)];
        const amount = Math.floor(Math.random() * (event.max - event.min + 1)) + event.min;
        return { type: 'negative', text: event.text, amount };
    }
};

module.exports = {
    config: {
        name: "work",
        aliases: ["trabalhar", "job", "trampo"],
        version: "1.1",
        author: "SeuNome",
        countDown: 5,
        role: 0,
        description: {
            pt: "Trabalhe para ganhar moedas (5x por dia)"
        },
        category: "economy",
        guide: {
            pt: "   {pn}: Trabalhe e ganhe dinheiro\n   {pn} info: Veja quantas vezes trabalhou hoje"
        }
    },

    onStart: async function ({ message, event, args, usersData }) {
        try {
            const { senderID } = event;
            const userId = parseInt(senderID);
            const command = args[0]?.toLowerCase();

            let data = loadData();

            // Busca nome
            let userName = `User_${userId}`;
            try {
                const userInfo = await usersData.get(userId);
                if (userInfo && userInfo.name) {
                    userName = userInfo.name;
                }
            } catch (e) {
                console.error('Erro ao buscar nome:', e);
            }

            data = ensureUser(data, userId, userName);
            const user = data.users[userId];

            // 🔥 VERIFICA SE O DIA RESETOU
            const today = new Date().toDateString();
            const lastReset = user.work_last_reset ? new Date(user.work_last_reset).toDateString() : '';
            
            if (today !== lastReset) {
                user.work_count = 0;
                user.work_last_reset = Date.now();
                saveData(data);
            }

            // 🔥 COMANDO INFO
            if (command === "info" || command === "status") {
                const remaining = Math.max(0, 5 - (user.work_count || 0));
                let msg = `📊 **${userName}**\n\n`;
                msg += `💼 Trabalhos hoje: ${user.work_count || 0}/5\n`;
                msg += `⏳ Restantes: ${remaining}\n`;
                msg += `💰 Saldo: ${user.money || 0}$`;
                
                const sent = await message.reply(msg);
                await sent.react('📊');
                return;
            }

            // 🔥 VERIFICA LIMITE DIÁRIO
            const workCount = user.work_count || 0;
            if (workCount >= 5) {
                const msg = `⏳ | VOCÊ JÁ TRABALHOU **5 VEZES** HOJE!\n💰 Saldo: ${user.money || 0}$\n🔄 Volte amanhã!`;
                const sent = await message.reply(msg);
                await sent.react('⏰');
                return;
            }

            // 🔥 GERA EVENTO ALEATÓRIO
            const event = getRandomEvent();
            let newMoney = user.money || 0;
            let msg = '';

            if (event.type === 'positive') {
                newMoney += event.amount;
                msg += `✅ **${event.text}**\n`;
                msg += `💰 +${event.amount}$\n`;
                msg += `💵 Novo saldo: ${newMoney}$\n\n`;
                msg += `🎯 Trabalhos hoje: ${workCount + 1}/5`;

                const sent = await message.reply(msg);
                await sent.react('✅');

            } else {
                if (newMoney < event.amount) {
                    msg += `❌ **${event.text}**\n`;
                    msg += `💸 -${newMoney}$ (não tinha saldo suficiente)\n`;
                    msg += `💵 Novo saldo: 0$\n\n`;
                    msg += `🎯 Trabalhos hoje: ${workCount + 1}/5`;
                    newMoney = 0;

                    const sent = await message.reply(msg);
                    await sent.react('💀');
                } else {
                    msg += `❌ **${event.text}**\n`;
                    msg += `💸 -${event.amount}$\n`;
                    msg += `💵 Novo saldo: ${newMoney - event.amount}$\n\n`;
                    msg += `🎯 Trabalhos hoje: ${workCount + 1}/5`;
                    newMoney -= event.amount;

                    const sent = await message.reply(msg);
                    await sent.react('💀');
                }
            }

            // 🔥 ATUALIZA DADOS
            user.money = newMoney;
            user.work_count = (user.work_count || 0) + 1;
            if (!user.work_last_reset) {
                user.work_last_reset = Date.now();
            }
            saveData(data);

        } catch (error) {
            console.error('Erro no work:', error);
            const sent = await message.reply("❌ | OPS! DEU RUIM NO TRABALHO!\n💬 " + error.message);
            await sent.react('❌');
        }
    }
};
