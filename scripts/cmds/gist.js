const gistController = require('../../database/controller/gistController.js');

module.exports = {
    config: {
        name: "gist",
        aliases: ["backup", "gistbackup"],
        version: "1.0",
        author: "SeuNome",
        role: 2,
        description: {
            pt: "Gerencia backups no Gist (send/load/status)"
        },
        category: "admin",
        guide: {
            pt: "   {pn} send: Envia backup para o Gist\n" +
                 "   {pn} load: Carrega backup do Gist\n" +
                 "   {pn} status: Verifica status do backup"
        }
    },

    onStart: async function ({ api, event, message, usersData }) {
        const { threadID, messageID } = event;
        const args = event.body.split(' ').slice(1);
        const action = args[0]?.toLowerCase();

        try {
            if (!action || !['send', 'load', 'status'].includes(action)) {
                return api.sendMessage(
                    `📋 **COMANDO GIST**\n\n` +
                    `🔹 !gist send - Envia backup para o Gist\n` +
                    `🔹 !gist load - Carrega backup do Gist\n` +
                    `🔹 !gist status - Verifica status do backup\n\n` +
                    `⚠️ Apenas administradores do bot podem usar.`,
                    threadID,
                    messageID
                );
            }

            if (action === 'send') {
                const loading = await api.sendMessage('⏳ | Enviando backup...', threadID, messageID);
                const result = await gistController.sendToGist();

                if (result.success) {
                    return api.editMessage(
                        `✅ **BACKUP ENVIADO!**\n\n` +
                        `📊 **Usuários:** ${result.count}\n` +
                        `📁 **Gist:** ${result.url}\n` +
                        `🕒 **Data:** ${result.updated}`,
                        loading.messageID
                    );
                } else {
                    return api.editMessage(`❌ | ${result.error}`, loading.messageID);
                }
            }

            if (action === 'load') {
                const status = await gistController.getGistStatus();
                if (!status.success) {
                    return api.sendMessage(`❌ | ERRO: ${status.error}`, threadID, messageID);
                }

                if (!status.hasFile) {
                    return api.sendMessage(
                        `❌ | Nenhum backup encontrado!\n💡 Use !gist send primeiro.`,
                        threadID,
                        messageID
                    );
                }

                const loading = await api.sendMessage('⏳ | Carregando backup...', threadID, messageID);
                const result = await gistController.loadFromGist();

                if (result.success) {
                    if (global.db && global.db.allUserData) {
                        global.db.allUserData = result.data;
                    }

                    return api.editMessage(
                        `✅ **BACKUP CARREGADO!**\n\n` +
                        `📊 **Usuários:** ${result.count}\n` +
                        `🕒 **Data:** ${result.updated}`,
                        loading.messageID
                    );
                } else {
                    return api.editMessage(`❌ | ${result.error}`, loading.messageID);
                }
            }

            if (action === 'status') {
                const status = await gistController.getGistStatus();

                if (!status.success) {
                    return api.sendMessage(`❌ | ERRO: ${status.error}`, threadID, messageID);
                }

                return api.sendMessage(
                    `📊 **STATUS DO BACKUP**\n\n` +
                    `📁 **Gist:** ${status.url}\n` +
                    `📄 **Arquivo:** ${status.hasFile ? '✅ Existe' : '❌ Não existe'}\n` +
                    `📊 **Usuários locais:** ${status.localUsers}\n` +
                    `🕒 **Atualizado:** ${new Date(status.updated).toLocaleString()}\n` +
                    `🔒 **Privacidade:** ${status.public ? '🌍 Público' : '🔒 Privado'}`,
                    threadID,
                    messageID
                );
            }

        } catch (error) {
            console.error('Erro no gist:', error);
            return api.sendMessage(`❌ | ERRO: ${error.message}`, threadID, messageID);
        }
    }
};
