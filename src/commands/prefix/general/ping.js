module.exports = {
  name: "ping",
  aliases: ["ws"],
  description: "returns client websocket.",
  guildOnly: false,
  dmOnly: false,
  devOnly: false,
  ownerOnly: true,
  permissions: {
    member: ["SendMessages"],
    bot: ["SendMessages"],
  },
  cooldown: 5,
  async execute(client, message, args) {
    await message.reply({
      content: "pong!",
    });
  },
};
