const { EmbedBuilder } = require("discord.js");

async function sendError(error, message) {
  const embed = new EmbedBuilder()
    .setDescription(`❌ | ${error}`)
    .setColor("Red");
  try {
    message.reply({ embeds: [embed] }).then((msg) => {
      setTimeout(() => {
        msg.delete().catch(() => {});
      }, 5000);
    });
    setTimeout(() => {
      message.delete().catch(() => {});
    }, 10000);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  sendError,
};
