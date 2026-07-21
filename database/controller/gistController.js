const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// 🔥 CONFIGURAÇÕES DO GIST
const GIST_TOKEN = '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';  // 🔥 COLE O NOVO TOKEN
const GIST_ID = '2ab732f2f9d4bfe36b15e6cfcbe3c6b1';

// 🔥 CAMINHO DO ARQUIVO DE DADOS
const DATA_PATH = path.join(__dirname, '..', 'data', 'usersData.json');

// 🔥 ENVIA DADOS PARA O GIST
async function sendToGist() {
    try {
        // Verifica se o arquivo existe
        if (!fs.existsSync(DATA_PATH)) {
            // Se não existe, cria um vazio
            fs.ensureDirSync(path.dirname(DATA_PATH));
            fs.writeFileSync(DATA_PATH, '[]', 'utf8');
        }

        const data = fs.readFileSync(DATA_PATH, 'utf8');
        JSON.parse(data); // Valida o JSON

        const response = await axios.patch(
            `https://api.github.com/gists/${GIST_ID}`,
            {
                files: {
                    'usersData.json': {
                        content: data
                    }
                }
            },
            {
                headers: {
                    Authorization: `token ${GIST_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const users = JSON.parse(data);
        const count = Array.isArray(users) ? users.length : Object.keys(users).length;

        return {
            success: true,
            message: '✅ Dados enviados para o Gist!',
            url: response.data.html_url,
            count: count,
            updated: new Date().toLocaleString()
        };

    } catch (error) {
        console.error('Erro ao enviar:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

// 🔥 CARREGA DADOS DO GIST
async function loadFromGist() {
    try {
        const response = await axios.get(
            `https://api.github.com/gists/${GIST_ID}`,
            {
                headers: {
                    Authorization: `token ${GIST_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const files = response.data.files;
        if (!files || !files['usersData.json']) {
            return { success: false, error: 'Arquivo usersData.json não encontrado no Gist!' };
        }

        const content = files['usersData.json'].content;
        const data = JSON.parse(content);

        // 🔥 CRIA A PASTA SE NÃO EXISTIR E SALVA O ARQUIVO
        fs.ensureDirSync(path.dirname(DATA_PATH));
        fs.writeFileSync(DATA_PATH, content, 'utf8');

        const count = Array.isArray(data) ? data.length : Object.keys(data).length;

        return {
            success: true,
            message: '✅ Dados carregados do Gist!',
            data: data,
            count: count,
            updated: new Date().toLocaleString()
        };

    } catch (error) {
        console.error('Erro ao carregar:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

// 🔥 VERIFICA STATUS DO GIST
async function getGistStatus() {
    try {
        const response = await axios.get(
            `https://api.github.com/gists/${GIST_ID}`,
            {
                headers: {
                    Authorization: `token ${GIST_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const files = response.data.files;
        const hasFile = files && files['usersData.json'];
        
        let localUsers = 0;
        if (fs.existsSync(DATA_PATH)) {
            try {
                const localData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
                localUsers = Array.isArray(localData) ? localData.length : Object.keys(localData).length;
            } catch (e) {}
        }

        return {
            success: true,
            hasFile: hasFile,
            url: response.data.html_url,
            updated: response.data.updated_at,
            public: response.data.public,
            description: response.data.description || 'Sem descrição',
            localUsers: localUsers
        };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendToGist,
    loadFromGist,
    getGistStatus
};
