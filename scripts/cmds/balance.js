module.exports = {
    config: {
        name: "balance",
        aliases: ["bal", "money", "carteira", "saldo"],
        version: "1.2",
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

    onStart: async function ({ message, event, args, usersData }) {
        try {
            const { senderID, mentions } = event;
            const userId = parseInt(senderID);

            // Garante que o usuário existe
            const userExists = await usersData.existsSync(userId);
            if (!userExists) {
                await usersData.create(userId);
            }

            // Se tiver menção
            if (Object.keys(mentions).length > 0) {
                const targetId = parseInt(Object.keys(mentions)[0]);
                const targetName = mentions[targetId].replace(/@/g, '').trim();
                
                const targetExists = await usersData.existsSync(targetId);
                if (!targetExists) {
                    await usersData.create(targetId);
                }
                
                const money = await usersData.get(targetId, "money") || 0;
                return message.reply(`💰 **${targetName}** tem **${money}$**`);
            }

            // Ver próprio saldo
            const money = await usersData.get(userId, "money") || 0;
            const name = await usersData.get(userId, "name") || `User_${userId}`;
            
            return message.reply(`💰 **${name}**\n💵 Saldo: **${money}$**`);

        } catch (error) {
            console.error('Erro no balance:', error);
            return message.reply(`❌ | ERRO AO CARREGAR SALDO!\n💬 ${error.message}`);
        }
    }
};
