const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.20",
    author: "ShAn",
    countDown: 5,
    role: 0,
    shortDescription: { en: "View command usage" },
    longDescription: { en: "View command usage and list all commands" },
    category: "info",
    guide: { en: "{pn} / help cmdName\n{pn} -c <categoryName>" },
    priority: 1
  },
  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;
        const category = value.config.category || "Other";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      let msg = ``;
      Object.keys(categories).sort().forEach((category) => {
        msg += `╭─────⭓ ${category.toUpperCase()}\n`;
        const names = categories[category].commands.sort();
        let line = "";
        names.forEach((item, i) => {
          line += ` ✧${item}`;
          if((i+1) % 3 === 0) line += `\n`;
        });
        msg += `${line}\n╰─────────────⭓\n`;
      });

      msg += `⭔ Total Commands: ${commands.size}\n`;
      msg += `⭔ Type ${prefix}help <cmd> to see details.\n`;
      msg += `╭─✦ ADMIN: Snow 彡\n`;
      msg += `├‣ WHATSAPP\n`;
      msg += `╰‣ m.me/gerson.azael0`;

      await message.reply({ body: msg });

    } else if (args[0] === "-c") {
      if (!args[1]) {
        await message.reply("Please specify a category name.");
        return;
      }
      const categoryName = args[1].toLowerCase();
      const filteredCommands = Array.from(commands.values()).filter(
        (cmd) => cmd.config.category?.toLowerCase() === categoryName
      );
      if (filteredCommands.length === 0) {
        await message.reply(`No commands found in the category "${categoryName}".`);
        return;
      }
      let msg = `╔══════════════╗\n🔹 ${categoryName.toUpperCase()} COMMANDS 🔹\n╚══════════════╝\n`;
      filteredCommands.forEach((cmd) => {
        msg += `\n✧ ${cmd.config.name}`;
      });
      await message.reply(msg);

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));
      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const longDescription = configCommand.longDescription? configCommand.longDescription.en || "No description" : "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);
        const response = `╭── NAME ────⭓\n│ ${configCommand.name}\n├── INFO\n│ Description: ${longDescription}\n│ Other names: ${configCommand.aliases? configCommand.aliases.join(", ") : "Do not have"}\n│ Version: ${configCommand.version || "1.0"}\n│ Role: ${roleText}\n│ Time per command: ${configCommand.countDown || 1}s\n│ Author: ${author}\n├── Usage\n│ ${usage}\n├── Notes\n│ The content inside <ShAn> can be changed\n│ The content inside [a|b|c] is a or b or c\n╰━━━━━━━❖`;
        await message.reply(response);
      }
    }
  }
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return "0 (All users)";
    case 1: return "1 (Group administrators)";
    case 2: return "2 (Admin bot)";
    default: return "Unknown role";
  }
                      }
