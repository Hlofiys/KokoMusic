const { MessageEmbed, MessageReaction } = require("discord.js");

module.exports = {
  name: "config",
  description: "Настройки бота",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: ["conf"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Config = new MessageEmbed()
      .setAuthor("Настройки Сервера", client.botconfig.IconURL)
      .setColor(client.botconfig.EmbedColor)
      .addField("Префикс", GuildDB.prefix, true)
      .addField("Роль DJ", GuildDB.DJ ? `<@&${GuildDB.DJ}>` : "Не установлена", true)
      .setDescription(`
What would you like to edit?

:one: - Префикс на сервере
:two: - Роль DJ
`);

    let ConfigMessage = await message.channel.send(Config);
    await ConfigMessage.react("1️⃣");
    await ConfigMessage.react("2️⃣");
    let emoji = await ConfigMessage.awaitReactions(
      (reaction, user) =>
        user.id === message.author.id &&
        ["1️⃣", "2️⃣"].includes(reaction.emoji.name),
      { max: 1, errors: ["time"], time: 30000 }
    ).catch(() => {
      ConfigMessage.reactions.removeAll();
      client.sendTime(
        message.channel,
        "❌ | **Время ожидания истекло. Напиши команду еще раз**"
      );
      ConfigMessage.delete(Config);
    });
    let isOk = false;
    try {
      emoji = emoji.first();
    } catch {
      isOk = true;
    }
    if (isOk) return; //im idiot sry ;-;
    /**@type {MessageReaction} */
    let em = emoji;
    ConfigMessage.reactions.removeAll();
    if (em._emoji.name === "1️⃣") {
      await client.sendTime(
        message.channel,
        "На что ты хочешь изменить префикс?"
      );
      let prefix = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!prefix.first())
        return client.sendTime(
          message.channel,
          "Время ожидания истекло"
        );
      prefix = prefix.first();
      prefix = prefix.content;

      await client.database.guild.set(message.guild.id, {
        prefix: prefix,
        DJ: GuildDB.DJ,
      });

      client.sendTime(
        message.channel,
        `Успешно сохранил префикс как \`${prefix}\``
      );
    } else {
      await client.sendTime(
        message.channel,
        "Пингани роль которую ты хочешь сделать диджейной"
      );
      let role = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["время"] }
      );
      if (!role.first())
        return client.sendTime(
          message.channel,
          "Время ожидания истекло"
        );
      role = role.first();
      if (!role.mentions.roles.first())
        return client.sendTime(
          message.channel,
          "Пингани роль которую ты хочешь сделать только для диджеев"
        );
      role = role.mentions.roles.first();

      await client.database.guild.set(message.guild.id, {
        prefix: GuildDB.prefix,
        DJ: role.id,
      });

      client.sendTime(
        message.channel,
        "Успешно сохранил роль DJ как <@&" + role.id + ">"
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "prefix",
        description: "Посмотреть префикс бота",
        type: 1,
        required: false,
        options: [
          {
            name: "symbol",
            description: "Установить префикс бота",
            type: 3,
            required: false,
          },
        ],
      },
      {
        name: "dj",
        description: "Посмотреть роль DJ",
        type: 1,
        required: false,
        options: [
          {
            name: "role",
            description: "Установить роль DJ",
            type: 8,
            required: false,
          },
        ],
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
      let config = interaction.data.options[0].name;
      let member = await interaction.guild.members.fetch(interaction.user_id);
      //TODO: if no admin perms return...
      if (config === "prefix") {
        //prefix stuff
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          //has prefix
          let prefix = interaction.data.options[0].options[0].value;
          await client.database.guild.set(interaction.guild.id, {
            prefix: prefix,
            DJ: GuildDB.DJ,
          });
          client.sendTime(
            interaction,
            `Префикс сменен на \`${prefix}\``
          );
        } else {
          //has not prefix
          client.sendTime(
            interaction,
            `Префикс этого сервера это \`${GuildDB.prefix}\``
          );
        }
      } else if (config === "djrole") {
        //DJ role
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          let role = interaction.guild.roles.cache.get(
            interaction.data.options[0].options[0].value
          );
          await client.database.guild.set(interaction.guild.id, {
            prefix: GuildDB.prefix,
            DJ: role.id,
          });
          client.sendTime(
            interaction,
            `Успешно сменил роль DJ на этом сервере на ${role.name}`
          );
        } else {
          /**
           * @type {require("discord.js").Role}
           */
          let role = interaction.guild.roles.cache.get(GuildDB.DJ);
          client.sendTime(
            interaction,
            `Роль DJ на этом сервере это ${role.name}`
          );
        }
      }
    },
  },
};
