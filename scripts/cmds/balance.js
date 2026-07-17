const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

// 🔥 CAMINHO DAS FONTES
const FONTS_DIR = path.join(__dirname, 'cache', 'fonts');
const FONT_URL = 'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Bold.ttf';
const FONT_URL_2 = 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf';

// 🔥 GARANTE QUE A PASTA DE FONTES EXISTE
if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
}

// 🔥 BAIXA AS FONTES (se não existirem)
async function downloadFonts() {
    const fontPath1 = path.join(FONTS_DIR, 'PlayfairDisplay-Bold.ttf');
    const fontPath2 = path.join(FONTS_DIR, 'Poppins-Bold.ttf');
    
    if (!fs.existsSync(fontPath1)) {
        try {
            const response = await axios.get(FONT_URL, { responseType: 'arraybuffer' });
            fs.writeFileSync(fontPath1, Buffer.from(response.data));
            console.log('✅ Fonte PlayfairDisplay baixada!');
        } catch (e) {
            console.log('❌ Erro ao baixar fonte PlayfairDisplay');
        }
    }
    
    if (!fs.existsSync(fontPath2)) {
        try {
            const response = await axios.get(FONT_URL_2, { responseType: 'arraybuffer' });
            fs.writeFileSync(fontPath2, Buffer.from(response.data));
            console.log('✅ Fonte Poppins baixada!');
        } catch (e) {
            console.log('❌ Erro ao baixar fonte Poppins');
        }
    }
    
    // Registra as fontes
    try {
        registerFont(fontPath1, { family: 'PlayfairDisplay' });
        registerFont(fontPath2, { family: 'Poppins' });
        console.log('✅ Fontes registradas com sucesso!');
    } catch (e) {
        console.log('❌ Erro ao registrar fontes:', e.message);
    }
}

// 🔥 CHAMA O DOWNLOAD DAS FONTES
downloadFonts();

// 🔥 FUNÇÃO PARA TEXTO ESTILIZADO (transforma texto normal em fontes especiais)
const styleText = (text) => {
    const map = {
        'a': 'Ꭺ', 'b': 'Ᏸ', 'c': 'Ꮯ', 'd': 'Ꭰ', 'e': 'Ꭼ', 'f': 'Ꭰ', 'g': 'Ꮹ',
        'h': 'Ꮋ', 'i': 'Ꭵ', 'j': 'Ꮰ', 'k': 'Ꮶ', 'l': 'Ꮮ', 'm': 'Ꮇ', 'n': 'Ꮑ',
        'o': 'Ꮎ', 'p': 'Ꮲ', 'q': 'Ꭴ', 'r': 'Ꮢ', 's': 'Ꮥ', 't': 'Ꮖ', 'u': 'Ꮜ',
        'v': 'Ꮙ', 'w': 'Ꮃ', 'x': 'Ꮖ', 'y': 'Ꮍ', 'z': 'Ꮓ',
        'A': 'Ꭺ', 'B': 'Ᏸ', 'C': 'Ꮯ', 'D': 'Ꭰ', 'E': 'Ꭼ', 'F': 'Ꭰ', 'G': 'Ꮹ',
        'H': 'Ꮋ', 'I': 'Ꭵ', 'J': 'Ꮰ', 'K': 'Ꮶ', 'L': 'Ꮮ', 'M': 'Ꮇ', 'N': 'Ꮑ',
        'O': 'Ꮎ', 'P': 'Ꮲ', 'Q': 'Ꭴ', 'R': 'Ꮢ', 'S': 'Ꮥ', 'T': 'Ꮖ', 'U': 'Ꮜ',
        'V': 'Ꮙ', 'W': 'Ꮃ', 'X': 'Ꮖ', 'Y': 'Ꮍ', 'Z': 'Ꮓ'
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
        version: "3.4",
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

            const name = targetName || userData.name || `User_${userId}`;
            const money = userData.money || 0;
            const exp = userData.exp || 0;
            const level = getLevel(money);

            // RANK
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

            // 🔥 APLICA O ESTILO NAS FONTES
            const styledName = styleText(name);
            const styledRank = styleText(rankText);
            const styledLevel = styleText(level.name);

            const pathImg = path.join(__dirname, 'cache', `balance_${userId}.png`);
            
            // 🔥 GERA O BANNER
            await generateBanner(
                pathImg,
                styledName,
                money,
                exp,
                { ...level, name: styledLevel },
                styledRank,
                rankColor,
                userId,
                totalPlayers,
                name // nome original pro avatar
            );

            return api.sendMessage(
                { 
                    body: `💰 ${styledName}`,
                    attachment: fs.createReadStream(pathImg) 
                },
                threadID,
                () => fs.unlinkSync(pathImg),
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
async function generateBanner(pathImg, name, money, exp, level, rankText, rankColor, userId, totalPlayers, originalName) {
    const width = 1000;
    const height = 350;
    const canvas = createCanvas(width, height);
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

    // 🔥 AVATAR
    try {
        const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=300&height=300`;
        const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        const avatarBuffer = Buffer.from(avatarResponse.data, 'utf-8');
        const avatarPath = path.join(__dirname, 'cache', `avatar_${userId}.png`);
        fs.writeFileSync(avatarPath, avatarBuffer);
        
        const avatar = await loadImage(avatarPath);
        const avatarSize = 130;
        const avatarX = 60;
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
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 + 2, 0, Math.PI * 2);
        ctx.stroke();

        fs.unlinkSync(avatarPath);

    } catch (e) {
        const avatarSize = 130;
        const avatarX = 60;
        const avatarY = (height - avatarSize) / 2;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.fillStyle = '#1a2a6c';
        ctx.fill();
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('👤', avatarX + avatarSize/2, avatarY + avatarSize/2 + 18);
    }

    // 🔥 LINHA DIVISÓRIA
    ctx.strokeStyle = 'rgba(74, 158, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(220, 30);
    ctx.lineTo(220, height - 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // 🔥 INFORMAÇÕES
    const infoX = 260;
    let currentY = 55;

    // 🔥 USA AS FONTES BAIXADAS
    const fontPath1 = path.join(FONTS_DIR, 'PlayfairDisplay-Bold.ttf');
    const fontPath2 = path.join(FONTS_DIR, 'Poppins-Bold.ttf');
    
    // Tenta usar a fonte baixada, se não tiver, usa Arial
    let fontFamily = 'Arial';
    try {
        if (fs.existsSync(fontPath1)) {
            fontFamily = 'PlayfairDisplay';
        } else if (fs.existsSync(fontPath2)) {
            fontFamily = 'Poppins';
        }
    } catch (e) {}

    // NÍVEL
    ctx.shadowColor = level.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = level.color;
    ctx.font = `bold 18px ${fontFamily}, Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(level.name, infoX, currentY);
    ctx.shadowBlur = 0;
    currentY += 35;

    // NOME (fonte estilizada)
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#00e5ff';
    ctx.font = `bold 38px ${fontFamily}, Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(name, infoX, currentY);
    ctx.shadowBlur = 0;
    currentY += 45;

    // LINHA
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(infoX, currentY - 10);
    ctx.lineTo(infoX + 400, currentY - 10);
    ctx.stroke();

    // RANK
    ctx.shadowColor = rankColor;
    ctx.shadowBlur = 15;
    ctx.fillStyle = rankColor;
    ctx.font = `bold 20px ${fontFamily}, Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(rankText, infoX, currentY + 15);
    ctx.shadowBlur = 0;
    currentY += 45;

    // DINHEIRO
    const formattedMoney = formatMoney(money);
    const moneyColor = money >= 10000 ? '#FFD700' : money >= 1000 ? '#00ff88' : '#ffffff';
    
    ctx.shadowColor = moneyColor;
    ctx.shadowBlur = 30;
    ctx.fillStyle = moneyColor;
    ctx.font = `bold 46px ${fontFamily}, Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(formattedMoney, infoX, currentY);
    ctx.shadowBlur = 0;
    currentY += 55;

    // EXPERIÊNCIA
    ctx.fillStyle = '#00d4ff';
    ctx.font = `16px ${fontFamily}, Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(`⭐ ${exp} XP`, infoX, currentY);
    currentY += 30;

    // TOTAL JOGADORES
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = `13px ${fontFamily}, Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(`👥 ${totalPlayers} jogadores`, infoX, currentY);

    // BARRA DE PROGRESSO
    const barX = infoX;
    const barY = currentY + 20;
    const barWidth = 300;
    const barHeight = 8;
    
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    roundRect(ctx, barX, barY, barWidth, barHeight, 4);
    ctx.fill();

    const progress = Math.min((money / 100000) * 100, 100);
    ctx.fillStyle = level.color;
    ctx.shadowColor = level.color;
    ctx.shadowBlur = 10;
    roundRect(ctx, barX, barY, (progress / 100) * barWidth, barHeight, 4);
    ctx.fill();
    ctx.shadowBlur = 0;

    // RODAPÉ
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = `10px ${fontFamily}, Arial`;
    ctx.textAlign = 'right';
    ctx.fillText('✦ Hinata Bot ✦', width - 20, height - 12);

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
