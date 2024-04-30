const { EmbedBuilder, ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "avatar",
  type: ApplicationCommandType.User,
  async execute(client, interaction) {
    const { targetId, guild } = interaction;
    await interaction.deferReply({ ephemeral: true });
    const member = guild.members.cache.get(targetId);
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(member.user.accentColor ?? "Random")
          .setTitle(`${member.nickname ?? member.user.globalName}'s Avatar.`)
          .setImage(
            member.user.displayAvatarURL({
              dynamic: true,
              size: 4096, //16, 32, 64, 128, 256, 512, 1024, 2048, 4096
            })
          ),
      ],
    });
  },
};
