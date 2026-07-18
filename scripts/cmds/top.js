const Canvas = require('canvas');
const fs = require('fs-extra');
const path = require('path');

// 🔥 MAPEAMENTO DE CARACTERES ESPECIAIS → LETRAS NORMAIS
const normalizeText = (text) => {
    if (!text) return 'User';
    const map = {
        'Ꭺ': 'A', 'Ᏸ': 'B', 'Ꮯ': 'C', 'Ꭰ': 'D', 'Ꭼ': 'E',
        'Ꮹ': 'G', 'Ꮋ': 'H', 'Ꭵ': 'I', 'Ꮰ': 'J',
        'Ꮶ': 'K', 'Ꮮ': 'L', 'Ꮇ': 'M', 'Ꮑ': 'N', 'Ꮎ': 'O',
        'Ꮲ': 'P', 'Ꭴ': 'Q', 'Ꮢ': 'R', 'Ꮥ': 'S', 'Ꮖ': 'T',
        'Ꮜ': 'U', 'Ꮙ': 'V', 'Ꮃ': 'W', 'Ꮍ': 'Y', 'Ꮓ': 'Z',
        'Ꮗ': 'B', 'Ꮛ': 'E', 'Ꮦ': 'T', 'Ꭹ': 'Y', 'Ꭷ': 'O',
        'Ꭾ': 'P', 'Ꮧ': 'A', 'Ꮥ': 'S', 'Ꮄ': 'D', 'Ꭶ': 'F',
        'Ꮆ': 'G', 'Ꮒ': 'H', 'Ꮅ': 'L', 'ፚ': 'Z', 'ጀ': 'C',
        'ፈ': 'F', 'Ꮙ': 'V', 'Ᏸ': 'B', 'Ꮑ': 'N', 'Ꮇ': 'M'
    };
    return text.split('').map(char => map[char] || char).join('');
};

// 🔥 FORMATAR DINHEIRO
const formatMoney = (num) => {
    if (!num) return '0$';
    const n = parseInt(num);
    if (n < 1000) return n + '$';
    if (n < 1000000) return (n / 1000).toFixed(1) + 'K$';
    if (n < 1000000000) return (n / 1000000).toFixed(1) + 'M$';
    if (n < 1000000000000) return (n / 1000000000).toFixed(1) + 'B$';
    return (n / 1000000000000).toFixed(1) + 'T$';
};

module.exports = {
    config: {
        name: "top",
        aliases: ["ranking", "maisricos"],
        version: "2.0",
        author: "SeuNome",
        countDown: 10,
        role: 0,
        description: {
            pt: "Veja o ranking dos mais ricos com imagem"
        },
        category: "economy",
        guide: {
            pt: "   {pn}: Ranking dos 10 mais ricos"
        }
    },

    onStart: async function ({ api, event, args, usersData }) {
        try {
            const { threadID, messageID } = event;

            // 🔥 PEGA TODOS OS USUÁRIOS
            const allUsers = await usersData.getAll();

            // 🔥 FILTRA E ORDENA POR DINHEIRO
            const sorted = allUsers
                .filter(u => (u.money || 0) > 0)
                .sort((a, b) => (b.money || 0) - (a.money || 0));

            if (sorted.length === 0) {
                return api.sendMessage('📊 | NINGUÉM TEM DINHEIRO AINDA!', threadID, messageID);
            }

            // 🔥 PEGA OS TOP 10
            const top10 = sorted.slice(0, 10);

            // 🔥 PREPARA OS DADOS
            const players = [];
            for (let i = 0; i < top10.length; i++) {
                const user = top10[i];
                const name = normalizeText(user.name || `User_${user.userID}`);
                const avatarUrl = await usersData.getAvatarUrl(user.userID);
                players.push({
                    name: name,
                    money: user.money || 0,
                    avatar: avatarUrl,
                    rank: i + 1
                });
            }

            // 🔥 GERA O BANNER
            const pathImg = path.join(__dirname, 'cache', 'top_ranking.png');
            await generateRankingBanner(pathImg, players);

            // 🔥 ENVIA A IMAGEM
            return api.sendMessage(
                {
                    body: '🏆 **RANKING DOS MAIS RICOS** 🏆',
                    attachment: fs.createReadStream(pathImg)
                },
                threadID,
                () => { if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); },
                messageID
            );

        } catch (error) {
            console.error('Erro no top:', error);
            return api.sendMessage(
                '❌ | ERRO: ' + error.message,
                event.threadID,
                event.messageID
            );
        }
    }
};

// 🔥 FUNÇÃO QUE GERA O BANNER DO RANKING
async function generateRankingBanner(pathImg, players) {
    const width = 1200;
    const height = 800;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 🔥 FUNDO
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0a1628');
    gradient.addColorStop(0.3, '#0f3460');
    gradient.addColorStop(0.7, '#1a2a6c');
    gradient.addColorStop(1, '#0a1628');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 🔥 BORDA
    ctx.shadowColor = '#4a9eff';
    ctx.shadowBlur = 30;
    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, width - 30, height - 30);
    ctx.shadowBlur = 0;

    // 🔥 PONTOS BRILHANTES
    for (let i = 0; i < 80; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (Math.random() * 0.1) + ')';
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // 🔥 TÍTULO
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 RANKING DOS MAIS RICOS 🏆', width / 2, 60);
    ctx.shadowBlur = 0;

    // 🔥 LINHA DO TÍTULO
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 80);
    ctx.lineTo(width - 100, 80);
    ctx.stroke();

    // 🔥 DESENHA OS JOGADORES (5 por linha)
    const avatarSize = 110;
    const spacingX = (width - (5 * avatarSize)) / 6;
    const startY = 130;
    const rowHeight = 180;

    for (let i = 0; i < Math.min(players.length, 10); i++) {
        const player = players[i];
        const row = Math.floor(i / 5);
        const col = i % 5;

        const x = spacingX + col * (avatarSize + spacingX);
        const y = startY + row * rowHeight;

        // 🔥 FUNDO DO CARD (transparente)
        ctx.shadowColor = 'rgba(74, 158, 255, 0.2)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.roundRect(x - 10, y - 10, avatarSize + 20, avatarSize + 60, 12);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Borda do card
        ctx.strokeStyle = 'rgba(74, 158, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x - 10, y - 10, avatarSize + 20, avatarSize + 60, 12);
        ctx.stroke();

        // 🔥 AVATAR
        try {
            const avatar = await Canvas.loadImage(player.avatar);
            ctx.shadowColor = '#4a9eff';
            ctx.shadowBlur = 30;

            ctx.save();
            ctx.beginPath();
            ctx.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, x, y, avatarSize, avatarSize);
            ctx.restore();
            ctx.shadowBlur = 0;

            // Borda do avatar
            ctx.strokeStyle = '#4a9eff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2 + 2, 0, Math.PI * 2);
            ctx.stroke();

        } catch (e) {
            // Fallback
            ctx.beginPath();
            ctx.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = '#1a2a6c';
            ctx.fill();
            ctx.strokeStyle = '#4a9eff';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('👤', x + avatarSize / 2, y + avatarSize / 2 + 15);
        }

        // 🔥 RANK (número)
        const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
        const rankColor = player.rank <= 3 ? rankColors[player.rank - 1] : '#4a9eff';

        ctx.shadowColor = rankColor;
        ctx.shadowBlur = 15;
        ctx.fillStyle = rankColor;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('#' + player.rank, x + avatarSize / 2, y + avatarSize + 25);
        ctx.shadowBlur = 0;

        // 🔥 NOME
        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        const displayName = player.name.length > 12 ? player.name.substring(0, 10) + '...' : player.name;
        ctx.fillText(displayName, x + avatarSize / 2, y + avatarSize + 50);

        // 🔥 DINHEIRO
        const moneyColor = player.money >= 10000 ? '#FFD700' : '#00ff88';
        ctx.fillStyle = moneyColor;
        ctx.font = 'bold 16px Arial';
        ctx.fillText(formatMoney(player.money), x + avatarSize / 2, y + avatarSize + 75);
    }

    // 🔥 RODAPÉ
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('✦ Hinata Bot ✦ ' + players.length + ' jogadores', width - 20, height - 15);

    // 🔥 SALVA A IMAGEM
    const imageBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pathImg, imageBuffer);
}

// 🔥 POLYFILL PARA roundRect (caso não exista)
if (!Canvas.Context2D.prototype.roundRect) {
    Canvas.Context2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        return this;
    };
}
