const { ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "say",
  type: ApplicationCommandType.Message,
  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });
    const { targetId: messageId, channel } = interaction;
    await channel.messages
      .fetch(messageId)
      .then(async (msg) => {
        channel.send({
          content: msg.content.toString(),
        });
        await interaction.editReply({
          content: "Sent the response.",
        });
      })
      .catch((err) => {
        client.logger.error(err, "CLIENT");
      });
  },
};
