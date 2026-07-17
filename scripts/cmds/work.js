const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "work",
        aliases: ["trabalhar", "job", "trampo"],
        version: "1.6",
        author: "SeuNome",
        countDown: 5,
        role: 0,
        description: {
            pt: "Trabalhe para ganhar moedas e experiência (5x por dia)"
        },
        category: "economy",
        guide: {
            pt: "   {pn}: Trabalhe e ganhe dinheiro\n   {pn} info: Veja quantas vezes trabalhou hoje"
        }
    },

    onStart: async function ({ args, message, event, usersData }) {
        try {
            const { senderID } = event;
            const userId = parseInt(senderID);
            const command = args[0]?.toLowerCase();

            // 🔥 VERIFICA SE O USUÁRIO EXISTE
            const userExists = await usersData.existsSync(userId);
            if (!userExists) {
                await usersData.create(userId);
            }

            // 🔥 COMANDO INFO
            if (command === "info" || command === "status") {
                const workCount = await usersData.get(userId, "data.work_count") || 0;
                const workLastReset = await usersData.get(userId, "data.work_last_reset") || 0;
                const money = await usersData.get(userId, "money") || 0;
                const exp = await usersData.get(userId, "exp") || 0;

                const today = new Date().toDateString();
                const lastReset = workLastReset ? new Date(workLastReset).toDateString() : '';
                
                let count = workCount;
                if (today !== lastReset) {
                    count = 0;
                }

                const remaining = Math.max(0, 5 - count);
                let msg = `📊 **SEU TRABALHO**\n\n`;
                msg += `💼 Trabalhos hoje: ${count}/5\n`;
                msg += `⏳ Restantes: ${remaining}\n`;
                msg += `💰 Moedas: ${money}$\n`;
                msg += `⭐ Experiência: ${exp} XP\n`;
                
                return message.reply(msg);
            }

            // 🔥 PEGA DADOS DO USUÁRIO
            let workCount = await usersData.get(userId, "data.work_count") || 0;
            let workLastReset = await usersData.get(userId, "data.work_last_reset") || 0;
            let money = await usersData.get(userId, "money") || 0;
            let exp = await usersData.get(userId, "exp") || 0;

            // 🔥 VERIFICA SE O DIA RESETOU
            const today = new Date().toDateString();
            const lastReset = workLastReset ? new Date(workLastReset).toDateString() : '';
            
            if (today !== lastReset) {
                workCount = 0;
                workLastReset = Date.now();
                await usersData.set(userId, {
                    "data.work_count": 0,
                    "data.work_last_reset": workLastReset
                });
            }

            // 🔥 VERIFICA LIMITE DIÁRIO
            if (workCount >= 5) {
                const msg = `⏳ | VOCÊ JÁ TRABALHOU **5 VEZES** HOJE!\n💰 Moedas: ${money}$\n⭐ XP: ${exp}\n🔄 Volte amanhã!`;
                return message.reply(msg);
            }

            // 🔥 GERA EVENTO ALEATÓRIO
            const eventWork = getRandomEvent();
            let newMoney = money;
            let newExp = exp;
            let msg = '';

            if (eventWork.type === 'positive') {
                const expGain = Math.floor(eventWork.amount * 0.2);
                newMoney += eventWork.amount;
                newExp += expGain;
                
                await usersData.set(userId, {
                    money: newMoney,
                    exp: newExp
                });
                
                msg += `✅ **${eventWork.text}**\n`;
                msg += `💰 +${eventWork.amount}$\n`;
                msg += `⭐ +${expGain} XP\n`;
                msg += `💵 Saldo: ${newMoney}$ | XP: ${newExp}\n\n`;
                msg += `🎯 Trabalhos hoje: ${workCount + 1}/5`;

            } else {
                const expGain = Math.floor(eventWork.amount * 0.1);
                newExp += expGain;
                
                if (newMoney < eventWork.amount) {
                    const lostAmount = newMoney;
                    await usersData.set(userId, {
                        money: 0,
                        exp: newExp
                    });
                    newMoney = 0;
                    
                    msg += `❌ **${eventWork.text}**\n`;
                    msg += `💸 -${lostAmount}$ (não tinha saldo suficiente)\n`;
                    msg += `⭐ +${expGain} XP\n`;
                    msg += `💵 Saldo: 0$ | XP: ${newExp}\n\n`;
                    msg += `🎯 Trabalhos hoje: ${workCount + 1}/5`;
                } else {
                    newMoney -= eventWork.amount;
                    
                    await usersData.set(userId, {
                        money: newMoney,
                        exp: newExp
                    });
                    
                    msg += `❌ **${eventWork.text}**\n`;
                    msg += `💸 -${eventWork.amount}$\n`;
                    msg += `⭐ +${expGain} XP\n`;
                    msg += `💵 Saldo: ${newMoney}$ | XP: ${newExp}\n\n`;
                    msg += `🎯 Trabalhos hoje: ${workCount + 1}/5`;
                }
            }

            // 🔥 ATUALIZA CONTADOR
            await usersData.set(userId, {
                "data.work_count": workCount + 1,
                "data.work_last_reset": workLastReset
            });

            return message.reply(msg);

        } catch (error) {
            console.error('Erro no work:', error);
            return message.reply(`❌ | OPS! DEU RUIM NO TRABALHO!\n💬 ${error.message}`);
        }
    }
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
