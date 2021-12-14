const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Информация о боте",
  usage: "[команда]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Commands = client.commands.map(
      (cmd) =>
        `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultПрефикс}${
          cmd.name
        }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    );

    let Embed = new MessageEmbed()
      .setAuthor(
        `Команды ${client.user.username}`,
        client.botconfig.IconURL
      )
      .setColor(client.botconfig.EmbedColor)
      .setFooter(
        `Чтобы получить инфу по команде пиши ${
          GuildDB ? GuildDB.prefix : client.botconfig.DefaultПрефикс
        }help [Команда] | Хрю хрю`
      ).setDescription(`${Commands.join("\n")}
  
  Кокоджамюа мьюзик версии:: v${require("../package.json").version}
  [✨ Сервер для помощи](${
    client.botconfig.SupportServer
  }) | [GitHub](https://github.com/Hlofiys/kokomusic) | [Сайт](${client.botconfig.Website}) | By [Hlofiys](https://github.com/Hlofiys)`);
    if (!args[0]) message.channel.send(Embed);
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendTime(
          message.channel,
          `❌ | Нет такой команды`
        );

      let embed = new MessageEmbed()
        .setAuthor(`Команда: ${cmd.name}`, client.botconfig.IconURL)
        .setDescription(cmd.description)
        .setColor("GREEN")
        //.addField("Name", cmd.name, true)
        .addField("Вариации", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          "Использование",
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultПрефикс}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "Использование",
          "Участник: " +
            cmd.permissions.member.join(", ") +
            "\nБот: " +
            cmd.permissions.channel.join(", "),
          true
        )
        .setFooter(
          `Префикс - ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultПрефикс
          }`
        );

      message.channel.send(embed);
    }
  },

  SlashCommand: {
    options: [
      {
        name: "команда",
        description: "получить инфу о команде",
        value: "команда",
        type: 3,
        required: false
      },
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

    run: async (client, interaction, args, { GuildDB }) => {
      let Commands = client.commands.map(
        (cmd) =>
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultПрефикс}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
      );

      let Embed = new MessageEmbed()
      .setAuthor(
        `Команды ${client.user.username}`,
        client.botconfig.IconURL
      )
      .setColor(client.botconfig.EmbedColor)
      .setFooter(
        `Чтобы получить инфу по команде пиши ${
          GuildDB ? GuildDB.prefix : client.botconfig.DefaultПрефикс
        }help [Команда] | Хрю хрю`
      ).setDescription(`${Commands.join("\n")}
  
  Кокоджамюа мьюзик версии:: v${require("../package.json").version}
  [✨ Сервер для помощи](${
    client.botconfig.SupportServer
  }) | [GitHub](https://github.com/Hlofiys/kokomusic) | [Сайт](${client.botconfig.Website}) | By [Hlofiys](https://github.com/Hlofiys)`);
    if (!args[0]) message.channel.send(Embed);
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendTime(
          message.channel,
          `❌ | Нет такой команды`
        );

      let embed = new MessageEmbed()
        .setAuthor(`Команда: ${cmd.name}`, client.botconfig.IconURL)
        .setDescription(cmd.description)
        .setColor("GREEN")
        //.addField("Name", cmd.name, true)
        .addField("Вариации", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          "Использование",
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultПрефикс}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "Использование",
          "Участник: " +
            cmd.permissions.member.join(", ") +
            "\nБот: " +
            cmd.permissions.channel.join(", "),
          true
        )
        .setFooter(
          `Префикс - ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultПрефикс
          }`
        );
        interaction.send(embed);
      }
    },
  },
};
