const Canvas = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

// 🔥 MAPEAMENTO DE CARACTERES ESTILIZADOS → TEXTO NORMAL
const unstyleText = (text) => {
    if (!text) return 'User';
    const map = {
        'Ꭺ': 'A', 'Ᏸ': 'B', 'Ꮯ': 'C', 'Ꭰ': 'D', 'Ꭼ': 'E', 
        'Ꮹ': 'G', 'Ꮋ': 'H', 'Ꭵ': 'I', 'Ꮰ': 'J',
        'Ꮶ': 'K', 'Ꮮ': 'L', 'Ꮇ': 'M', 'Ꮑ': 'N', 'Ꮎ': 'O',
        'Ꮲ': 'P', 'Ꭴ': 'Q', 'Ꮢ': 'R', 'Ꮥ': 'S', 'Ꮖ': 'T',
        'Ꮜ': 'U', 'Ꮙ': 'V', 'Ꮃ': 'W', 'Ꮍ': 'Y', 'Ꮓ': 'Z'
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

// 🔥 NÍVEL
const getLevel = (money) => {
    if (money < 100) return { name: '😴 Pobre', color: '#808080' };
    if (money < 500) return { name: '📚 Novato', color: '#4CAF50' };
    if (money < 2000) return { name: '⚡ Experiente', color: '#2196F3' };
    if (money < 10000) return { name: '👑 Rei', color: '#FFD700' };
    if (money < 50000) return { name: '🔥 Lendário', color: '#FF5722' };
    if (money < 100000) return { name: '⭐ Mítico', color: '#9C27B0' };
    return { name: '🚀 Modo Deus', color: '#FF0066' };
};

module.exports = {
    config: {
        name: "balance",
        aliases: ["bal", "money", "carteira", "saldo"],
        version: "3.9",
        author: "SeuNome",
        countDown: 5,
        role: 0,
        description: {
            pt: "Veja seu saldo em banner personalizado"
        },
        category: "economy",
        guide: {
            pt: "   {pn}: Ver seu saldo\n   {pn} @tag: Ver saldo de alguém"
        }
    },

    onStart: async function ({ api, event, args, usersData }) {
        try {
            const { senderID, mentions, threadID, messageID } = event;
            let userId = parseInt(senderID);
            let targetName = "";

            if (Object.keys(mentions).length > 0) {
                userId = parseInt(Object.keys(mentions)[0]);
                targetName = mentions[userId].replace(/@/g, '').trim();
            }

            let userData = await usersData.get(userId);
            if (!userData) {
                await usersData.set(userId, {
                    money: 0,
                    exp: 0,
                    name: targetName || `User_${userId}`,
                    data: {}
                });
                userData = await usersData.get(userId);
            }

            const originalName = targetName || userData.name || `User_${userId}`;
            const normalName = unstyleText(originalName);
            const money = userData.money || 0;
            const exp = userData.exp || 0;
            const level = getLevel(money);

            // 🔥 RANK
            const allUsers = await usersData.getAll();
            const sorted = allUsers
                .filter(u => (u.money || 0) > 0)
                .sort((a, b) => (b.money || 0) - (a.money || 0));
            
            const rank = sorted.findIndex(u => u.userID == userId) + 1;
            const totalPlayers = sorted.length;

            let rankText = '';
            let rankColor = '#4CAF50';
            if (rank <= 10) {
                rankText = `🏆 Top ${rank}`;
                rankColor = '#FFD700';
            } else if (rank <= 50) {
                rankText = `⭐ Top ${rank}`;
                rankColor = '#2196F3';
            } else if (rank <= 100) {
                rankText = `📊 Top ${rank}`;
                rankColor = '#4CAF50';
            } else {
                rankText = `📈 #${rank}`;
                rankColor = '#808080';
            }

            // 🔥 PEGA O AVATAR USANDO O MÉTODO DO BOT
            const avatarUrl = await usersData.getAvatarUrl(userId);

            const pathImg = path.join(__dirname, 'cache', `balance_${userId}.png`);
            
            await generateBanner(
                pathImg,
                normalName,
                money,
                exp,
                level,
                rankText,
                rankColor,
                avatarUrl,
                totalPlayers
            );

            return api.sendMessage(
                { 
                    body: `💰 ${originalName}`,
                    attachment: fs.createReadStream(pathImg) 
                },
                threadID,
                () => {
                    if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
                },
                messageID
            );

        } catch (error) {
            console.error('Erro no balance:', error);
            return api.sendMessage(
                `❌ | ERRO: ${error.message}`,
                event.threadID,
                event.messageID
            );
        }
    }
};

// 🔥 FUNÇÃO QUE GERA O BANNER
async function generateBanner(pathImg, name, money, exp, level, rankText, rankColor, avatarUrl, totalPlayers) {
    const width = 1000;
    const height = 400;
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
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    ctx.shadowBlur = 0;

    // 🔥 PONTOS BRILHANTES
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // 🔥 AVATAR (usando o método do bot)
    let avatarLoaded = false;
    try {
        const avatar = await Canvas.loadImage(avatarUrl);
        const avatarSize = 140;
        const avatarX = 50;
        const avatarY = (height - avatarSize) / 2;

        ctx.shadowColor = '#4a9eff';
        ctx.shadowBlur = 50;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 + 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowColor = '#4a9eff';
        ctx.shadowBlur = 40;
        ctx.strokeStyle = 'rgba(74, 158, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        avatarLoaded = true;

    } catch (e) {
        console.log('❌ Erro ao carregar avatar:', e.message);
    }

    // 🔥 SE O AVATAR NÃO CARREGOU, DESENHA UM PADRÃO
    if (!avatarLoaded) {
        const avatarSize = 140;
        const avatarX = 50;
        const avatarY = (height - avatarSize) / 2;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.fillStyle = '#1a2a6c';
        ctx.fill();
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('👤', avatarX + avatarSize/2, avatarY + avatarSize/2 + 20);
    }

    // 🔥 LINHA DIVISÓRIA
    ctx.strokeStyle = 'rgba(74, 158, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(230, 30);
    ctx.lineTo(230, height - 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // 🔥 INFORMAÇÕES
    const infoX = 270;
    let currentY = 50;

    // NÍVEL
    ctx.shadowColor = level.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = level.color;
    ctx.font = `bold 20px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(level.name, infoX, currentY);
    ctx.shadowBlur = 0;
    currentY += 45;

    // NOME
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#00e5ff';
    ctx.font = `bold 38px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(name, infoX, currentY);
    ctx.shadowBlur = 0;
    currentY += 55;

    // LINHA
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(infoX, currentY - 10);
    ctx.lineTo(infoX + 350, currentY - 10);
    ctx.stroke();

    // RANK
    ctx.shadowColor = rankColor;
    ctx.shadowBlur = 15;
    ctx.fillStyle = rankColor;
    ctx.font = `bold 22px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(rankText, infoX, currentY + 20);
    ctx.shadowBlur = 0;
    currentY += 55;

    // DINHEIRO
    const formattedMoney = formatMoney(money);
    const moneyColor = money >= 10000 ? '#FFD700' : money >= 1000 ? '#00ff88' : '#ffffff';
    
    ctx.shadowColor = moneyColor;
    ctx.shadowBlur = 30;
    ctx.fillStyle = moneyColor;
    ctx.font = `bold 48px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(formattedMoney, infoX, currentY);
    ctx.shadowBlur = 0;
    currentY += 60;

    // EXPERIÊNCIA
    ctx.fillStyle = '#00d4ff';
    ctx.font = `18px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(`⭐ ${exp} XP`, infoX, currentY);
    currentY += 35;

    // TOTAL JOGADORES
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `15px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(`👥 ${totalPlayers} jogadores`, infoX, currentY);
    currentY += 30;

    // BARRA DE PROGRESSO
    const barX = infoX;
    const barY = currentY + 5;
    const barWidth = 280;
    const barHeight = 10;
    
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    roundRect(ctx, barX, barY, barWidth, barHeight, 5);
    ctx.fill();

    const progress = Math.min((money / 100000) * 100, 100);
    ctx.fillStyle = level.color;
    ctx.shadowColor = level.color;
    ctx.shadowBlur = 10;
    roundRect(ctx, barX, barY, (progress / 100) * barWidth, barHeight, 5);
    ctx.fill();
    ctx.shadowBlur = 0;

    // RODAPÉ
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = `11px Arial`;
    ctx.textAlign = 'right';
    ctx.fillText('✦ Hinata Bot ✦', width - 20, height - 15);

    // SALVA A IMAGEM
    const imageBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(pathImg, imageBuffer);
}

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
