const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "grab",
  description: "Сохраняет текущую песню к тебе в лс",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["save"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Ничего не играет**"
      );
    if (!player.playing)
      return client.sendTime(
        message.channel,
        "❌ | **Ничего не играет**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Зайди в войс**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Зайди ко мне в войс**"
      );
    message.author
      .send(
        new MessageEmbed()
          .setAuthor(
            `Песня сохранена`,
            client.user.displayAvatarURL({
              dynamic: true,
            })
          )
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor(client.botconfig.EmbedColor)
          .setTitle(`**${player.queue.current.title}**`)
          .addField(
            `⌛ Длительность: `,
            `\`${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField(`🎵 Автор: `, `\`${player.queue.current.author}\``, true)
          .addField(
            `▶ Воспроизвести ее:`,
            `\`${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultПрефикс
            }play ${player.queue.current.uri}\``
          )
          .addField(`🔎 Сохранено в:`, `<#${message.channel.id}>`)
          .setFooter(
            `Запрошено: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          )
      )
      .catch((e) => {
        return message.channel.send("**:x: У тебя личка закрыта**");
      });

    client.sendTime(message.channel, "✅ | **Проверь ЛС**");
  },
  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const user = client.users.cache.get(interaction.member.user.id);
      const member = guild.members.cache.get(interaction.member.user.id);
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Ничего не играет**"
        );
      if (!player.playing)
        return client.sendTime(
          interaction,
          "❌ | **Ничего не играет**"
        );
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **В войс зайди**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Зайди ко мне в войс**"
        );
      try {
        let embed = new MessageEmbed()
          .setAuthor(`Песня сохранена: `, client.user.displayAvatarURL())
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor(client.botconfig.EmbedColor)
          .setTimestamp()
          .setTitle(`**${player.queue.current.title}**`)
          .addField(
            `⌛ Длительность: `,
            `\`${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField(`🎵 Автор: `, `\`${player.queue.current.author}\``, true)
          .addField(
            `▶ Воспроизвести ее:`,
            `\`${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultПрефикс
            }play ${player.queue.current.uri}\``
          )
          .addField(`🔎 Сохранено в:`, `<#${interaction.channel_id}>`)
          .setFooter(
            `Запрошено: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          );
        user.send(embed);
      } catch (e) {
        return client.sendTime(interaction, "**:x: У тебя личка закрыта**");
      }

      client.sendTime(interaction, "✅ | **Проверь ЛС**");
    },
  },
};
