module.exports = { 
  config: { 
    name: "auto", 
    version: "3.2", 
    author: "Luda", 
    countDown: 0, 
    role: 0, 
    shortDescription: "Reage nomes", 
    category: "chat" 
  }, 

  onStart: async function({ message }) { 
    return message.reply("🤖 Luda: Auto-reação ligada! Nomes: Gerson, Shiro, Yoshiro, Sousa, SadX, Snow"); 
  },

  onChat: async function({ event, message, api }) { 
    const msg = event.body ? event.body.toLowerCase().trim() : ""; 
    const botID = api.getCurrentUserID(); 
    if (event.senderID === botID) return; 

    const now = Date.now(); 
    if (global.autoCD && now - global.autoCD < 2000) return; 
    global.autoCD = now; 

    const reacoes = ["🖤", "❤️‍🩹", "😻" ,"💠"]; 
    const palavras = ["gerson", "shiro", "yoshiro", "sousa", "sadx", "snow", "sousasadx"];

    const foiMencionada = palavras.some(p => msg.includes(p)); 

    if (foiMencionada) { 
      const reacao = reacoes[Math.floor(Math.random() * reacoes.length)]; 
      api.setMessageReaction(reacao, event.messageID, () => {}, true); 
      return; 
    } 
  } 
};
