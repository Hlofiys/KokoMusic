const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "volume",
  description: "Посмотри или измени уровень громкости",
  usage: "громкость",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["vol", "v"],
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
    if (!args[0])
      return client.sendTime(
        message.channel,
        `🔉 | Нынешний уровень громкости \`${player.volume}\`.`
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Зайди ко мне в войс**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Зайди ко мне в войс**"
      );
    if (!parseInt(args[0]))
      return client.sendTime(
        message.channel,
        `**Укажи число между** \`1 - 100\``
      );
    let vol = parseInt(args[0]);
    if (vol < 0 || vol > 100) {
      return client.sendTime(
        message.channel,
        "❌ | **Укажи Число Между `1-100`**"
      );
    } else {
      player.setVolume(vol);
      client.sendTime(
        message.channel,
        `🔉 | **Громкость установлена на** \`${player.volume}\``
      );
    }
  },
  SlashCommand: {
    options: [
      {
        name: "amount",
        value: "amount",
        type: 4,
        required: false,
        description: "Укажи громкость из 1-100. Стандартная - 100",
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
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | В войс зайди"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Зайди ко мне в войс**"
        );
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Ничего не играет**"
        );
      if (!args[0].value)
        return client.sendTime(
          interaction,
          `🔉 | Нынешний уровень громкости \`${player.volume}\`.`
        );
      let vol = parseInt(args[0].value);
      if (!vol || vol < 1 || vol > 100)
        return client.sendTime(
          interaction,
          `**Укажи число между** \`1 - 100\``
        );
      player.setVolume(vol);
      client.sendTime(interaction, `🔉 | Громкость установлена на \`${player.volume}\``);
    },
  },
};
