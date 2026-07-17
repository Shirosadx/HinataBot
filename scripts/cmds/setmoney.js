const moment = require("moment-timezone");

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
            else {
                return message.reply(`❌ | MARQUE ALGUÉM OU COLOQUE O ID!\nEx: !setmoney 1000 @joao\nOU: !setmoney 1000 61590677925905`);
            }

            // 🔥 VALIDA O ID
            if (!targetId || targetId < 1000000000) {
                return message.reply(`❌ | ID INVÁLIDO! Use um ID válido do Facebook.`);
            }

            // 🔥 GARANTE QUE O USUÁRIO EXISTE
            const userExists = await usersData.existsSync(targetId);
            if (!userExists) {
                await usersData.create(targetId);
            }

            // 🔥 BUSCA O NOME
            try {
                const userInfo = await usersData.get(targetId);
                if (userInfo && userInfo.name) {
                    targetName = userInfo.name;
                }
            } catch (e) {}

            // 🔥 PEGA O SALDO ATUAL
            const currentMoney = await usersData.get(targetId, "money") || 0;
            let newMoney = 0;
            let responseMsg = "";

            // 🔥 EXECUTA O COMANDO
            if (command === "add" || command === "+") {
                newMoney = currentMoney + amount;
                await usersData.set(targetId, { money: newMoney });
                responseMsg = `✅ | TRANSFERÊNCIA COMPLETA!\n👤 **${targetName}**\n💰 +${amount}$\n💵 Novo saldo: ${newMoney}$`;
                
            } else if (command === "remove" || command === "-" || command === "sub") {
                newMoney = Math.max(0, currentMoney - amount);
                await usersData.set(targetId, { money: newMoney });
                responseMsg = `❌ | REMOVIDO!\n👤 **${targetName}**\n💰 -${amount}$\n💵 Novo saldo: ${newMoney}$`;
                
            } else {
                newMoney = amount;
                await usersData.set(targetId, { money: newMoney });
                responseMsg = `🔧 | SALDO DEFINIDO!\n👤 **${targetName}**\n💰 Novo saldo: ${newMoney}$`;
            }

            // 🔥 VERIFICA SE SALVOU
            const testMoney = await usersData.get(targetId, "money");
            console.log(`💰 Saldo de ${targetName} (${targetId}): ${testMoney}$`);

            return message.reply(responseMsg);

        } catch (error) {
            console.error('Erro no setmoney:', error);
            return message.reply(`❌ | OPS! DEU RUIM NO SETMONEY!\n💬 ${error.message}`);
        }
    }
};
