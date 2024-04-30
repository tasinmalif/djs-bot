const { ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "ping",
  description: "replies with bot ping.",
  type: ApplicationCommandType.ChatInput,
  options: [],
  permissions: ["SendMessages"],
  execute: async (client, interaction) => {
    await interaction.reply({
      content: "Pong!",
      ephemeral: true,
    });
  },
};
