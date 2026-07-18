const Canvas = require('canvas');
const fs = require('fs-extra');
const path = require('path');

// 🔥 FUNÇÃO ROUND RECT
function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// 🔥 MAPEAMENTO DE CARACTERES
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
        version: "2.6",
        author: "Hinata",
        countDown: 10,
        role: 0,
        description: {
            pt: "Veja o ranking dos mais ricos"
        },
        category: "economy",
        guide: {
            pt: "   {pn}: Ranking dos 10 mais ricos"
        }
    },

    onStart: async function ({ api, event, args, usersData }) {
        try {
            const { threadID, messageID } = event;

            const allUsers = await usersData.getAll();
            const sorted = allUsers
                .filter(u => (u.money || 0) > 0)
                .sort((a, b) => (b.money || 0) - (a.money || 0));

            if (sorted.length === 0) {
                return api.sendMessage('📊 | NINGUÉM TEM DINHEIRO AINDA!', threadID, messageID);
            }

            const top10 = sorted.slice(0, 10);
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

            const pathImg = path.join(__dirname, 'cache', 'top_ranking.png');
            await generateRankingBanner(pathImg, players);

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
            return api.sendMessage('❌ | ERRO: ' + error.message, event.threadID, event.messageID);
        }
    }
};

async function generateRankingBanner(pathImg, players) {
    const width = 1200;
    const height = 900;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 🔥 FUNDO AZUL TINGIDO A VERDE
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0a2e3a');
    gradient.addColorStop(0.3, '#0d4a3a');
    gradient.addColorStop(0.6, '#0a3a3a');
    gradient.addColorStop(1, '#062a2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 🔥 BORDA ROSA
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 30;
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 3;
    roundRect(ctx, 15, 15, width - 30, height - 30, 15);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 🔥 PONTOS BRILHANTES
    for (let i = 0; i < 80; i++) {
        const colors = ['rgba(0, 255, 200, 0.08)', 'rgba(0, 200, 255, 0.08)', 'rgba(255, 20, 147, 0.05)'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // 🔥 TÍTULO
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#FF1493';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 RANKING DOS MAIS RICOS 🏆', width / 2, 55);
    ctx.shadowBlur = 0;

    // 🔥 LINHA ROSA
    ctx.strokeStyle = 'rgba(255, 20, 147, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 70);
    ctx.lineTo(width - 150, 70);
    ctx.stroke();

    // 🔥 HINATA BOT BY GERSON
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🌸 Hinata Bot by Gerson 🌸', width / 2, 100);

    // 🔥 LINHA SEPARADORA
    ctx.strokeStyle = 'rgba(255, 20, 147, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 115);
    ctx.lineTo(width - 50, 115);
    ctx.stroke();

    // 🔥 ========== TOP 3 DESTAQUE ==========
    const avatarSize = 150;
    const spacingX = (width - (3 * avatarSize)) / 4;
    const startY = 140;

    for (let i = 0; i < Math.min(players.length, 3); i++) {
        const player = players[i];
        const x = spacingX + i * (avatarSize + spacingX);
        const y = startY;

        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 30;
        ctx.fillStyle = 'rgba(0, 255, 200, 0.05)';
        roundRect(ctx, x - 15, y - 15, avatarSize + 30, avatarSize + 85, 20);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = 'rgba(0, 255, 200, 0.2)';
        ctx.lineWidth = 2;
        roundRect(ctx, x - 15, y - 15, avatarSize + 30, avatarSize + 85, 20);
        ctx.stroke();

        try {
            const avatar = await Canvas.loadImage(player.avatar);
            ctx.shadowColor = '#00ffcc';
            ctx.shadowBlur = 30;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, x, y, avatarSize, avatarSize);
            ctx.restore();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#FF1493';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2 + 3, 0, Math.PI * 2);
            ctx.stroke();
        } catch (e) {
            ctx.beginPath();
            ctx.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = '#0a2e3a';
            ctx.fill();
            ctx.strokeStyle = '#FF1493';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = '60px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('👤', x + avatarSize / 2, y + avatarSize / 2 + 20);
        }

        const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
        const rankColor = rankColors[i];
        ctx.shadowColor = rankColor;
        ctx.shadowBlur = 25;
        ctx.fillStyle = rankColor;
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('#' + player.rank, x + avatarSize / 2, y + avatarSize + 35);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        const displayName = player.name.length > 14 ? player.name.substring(0, 12) + '...' : player.name;
        ctx.fillText(displayName, x + avatarSize / 2, y + avatarSize + 65);

        ctx.fillStyle = '#00ffcc';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(formatMoney(player.money), x + avatarSize / 2, y + avatarSize + 95);
    }

    // 🔥 ========== TOP 4-10 (8 PESSOAS) ==========
    if (players.length > 3) {
        const listStartY = 370;
        const cols = 4;
        const smallAvatarSize = 90;
        const spacingX2 = (width - (cols * smallAvatarSize)) / (cols + 1);
        const rowHeight = 180;

        for (let i = 3; i < Math.min(players.length, 10); i++) {
            const player = players[i];
            const index = i - 3;
            const row = Math.floor(index / cols);
            const col = index % cols;

            const x = spacingX2 + col * (smallAvatarSize + spacingX2);
            const y = listStartY + 20 + row * rowHeight;

            // Fundo do card
            ctx.fillStyle = 'rgba(0, 255, 200, 0.03)';
            roundRect(ctx, x - 5, y - 5, smallAvatarSize + 10, smallAvatarSize + 70, 10);
            ctx.fill();

            // AVATAR
            try {
                const avatar = await Canvas.loadImage(player.avatar);
                ctx.save();
                ctx.beginPath();
                ctx.arc(x + smallAvatarSize / 2, y + smallAvatarSize / 2, smallAvatarSize / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, x, y, smallAvatarSize, smallAvatarSize);
                ctx.restore();
                ctx.strokeStyle = 'rgba(0, 255, 200, 0.2)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x + smallAvatarSize / 2, y + smallAvatarSize / 2, smallAvatarSize / 2 + 1, 0, Math.PI * 2);
                ctx.stroke();
            } catch (e) {
                ctx.beginPath();
                ctx.arc(x + smallAvatarSize / 2, y + smallAvatarSize / 2, smallAvatarSize / 2, 0, Math.PI * 2);
                ctx.fillStyle = '#0a2e3a';
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.font = '35px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('👤', x + smallAvatarSize / 2, y + smallAvatarSize / 2 + 12);
            }

            // RANK
            ctx.fillStyle = '#88aacc';
            ctx.font = 'bold 15px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('#' + player.rank, x + smallAvatarSize / 2, y + smallAvatarSize + 22);

            // NOME
            ctx.fillStyle = '#aaddcc';
            ctx.font = '13px Arial';
            ctx.textAlign = 'center';
            const shortName = player.name.length > 10 ? player.name.substring(0, 8) + '..' : player.name;
            ctx.fillText(shortName, x + smallAvatarSize / 2, y + smallAvatarSize + 45);

            // 🔥 DINHEIRO (AGORA VISÍVEL)
            ctx.fillStyle = '#00ffcc';
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(formatMoney(player.money), x + smallAvatarSize / 2, y + smallAvatarSize + 65);
        }
    }

    // 🔥 RODAPÉ
    ctx.fillStyle = 'rgba(0, 255, 200, 0.15)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('✦ Hinata Bot by Gerson ✦', width - 20, height - 15);

    const imageBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pathImg, imageBuffer);
}
