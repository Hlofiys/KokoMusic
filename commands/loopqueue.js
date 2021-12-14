const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "loopqueue",
  description: "Цикл всей очереди",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["lq", "repeatqueue", "rq"],
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

    if (player.queueRepeat) {
      player.setQueueRepeat(false);
      client.sendTime(message.channel, `:repeat: Повтор Очереди \`выключен\``);
    } else {
      player.setQueueRepeat(true);
      client.sendTime(message.channel, `:repeat: Повтор Очереди \`включен\``);
    }
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
      let player = await client.Manager.get(interaction.guild_id);
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
      if (!player)
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
        !guild.me.voice.channel.equals(voiceChannel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Зайди ко мне в войс**"
        );

      if (player.queueRepeat) {
        player.setQueueRepeat(false);
        client.sendTime(interaction, `:repeat: **Повтор Очереди** \`выключен\``);
      } else {
        player.setQueueRepeat(true);
        client.sendTime(interaction, `:repeat: **Повтор Очереди** \`включен\``);
      }
      console.log(interaction.data);
    },
  },
};
