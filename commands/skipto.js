const { MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");

module.exports = {
  name: "skipto",
  description: `Пропустить до песни в очереди`,
  usage: "номер",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["st"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: client.botconfig.ServerDeafen,
    });

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

    try {
      if (!args[0])
        return client.sendTime(
          message.channel,
          `**Использование**: \`${GuildDB.prefix}skipto [число]\``
        );
      //if the wished track is bigger then the Queue Size
      if (Number(args[0]) > player.queue.size)
        return client.sendTime(
          message.channel,
          `❌ | Этой песни нет в очереди`
        );
      //remove all tracks to the jumped song
      player.queue.remove(0, Number(args[0]) - 1);
      //stop the player
      player.stop();
      //Send Success Message
      return client.sendTime(
        message.channel,
        `⏭ Пропущены \`${Number(args[0] - 1)}\` песни`
      );
    } catch (e) {
      console.log(String(e.stack).bgRed);
      client.sendError(message.channel, "Что-то пошло не так");
    }
  },
  SlashCommand: {
    options: [
      {
        name: "position",
        value: "[позиция]",
        type: 4,
        required: true,
        description: "Пропустить к определенной песне в очереди",
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
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
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
          `:x: | **Зайди ко мне в войс**`
        );
      let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
      if (!CheckNode || !CheckNode.connected) {
        return client.sendTime(
          interaction,
          "❌ | **Арсений еблан, кокоджамба умер**"
        );
      }

      let player = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel_id,
        selfDeafen: client.botconfig.ServerDeafen,
      });

      try {
        if (!interaction.data.options)
          return client.sendTime(
            interaction,
            `**Использование**: \`${GuildDB.prefix}skipto <number>\``
          );
        let skipTo = interaction.data.options[0].value;
        //if the wished track is bigger then the Queue Size
        if (
          skipTo !== null &&
          (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)
        )
          return client.sendTime(
            interaction,
            `❌ | Этой песни нет в очереди`
          );

        player.stop(skipTo);
        //Send Success Message
        return client.sendTime(
          interaction,
          `⏭ Пропущено \`${Number(skipTo)}\` песни`
        );
      } catch (e) {
        console.log(String(e.stack).bgRed);
        client.sendError(interaction, "Что-то пошло не так");
      }
    },
  },
};
