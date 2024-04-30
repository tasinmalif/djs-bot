const { Events, Collection, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(client, interaction) {
    const { logger, config, cooldowns } = client;
    if (interaction.isChatInputCommand()) {
      const command = client.commands.slash.get(interaction.commandName);
      if (!command) return;
      if (command.ownerOnly && interaction.user.id !== config.bot.ownerId) {
        interaction.reply({
          embeds: [
            new EmbedBuilder().setDescription(
              "This command can only be used by the bot owner."
            ),
          ],
          ephemeral: true,
        });
        return;
      }
      //cooldown
      if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const defaultCooldownDuration = 3;
      const cooldownAmount =
        (command.cooldown ?? defaultCooldownDuration) * 1_000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime =
          timestamps.get(interaction.user.id) + cooldownAmount;
        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1_000);
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `Please wait, you are on a cooldown for \`${command.name}\`. You can use this command again <t:${expiredTimestamp}:R>.`
                ),
            ],
            ephemeral: true,
          });
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

      try {
        command.execute(client, interaction);
      } catch (err) {
        logger.error(err.message, "Slash Command");
      }
    } else if (interaction.isMessageContextMenuCommand()) {
      const command = client.commands.message.get(interaction.commandName);
      if (!command) return;
      try {
        command.execute(client, interaction);
      } catch (err) {
        logger.error(err, "Message Command");
      }
    } else if (interaction.isUserContextMenuCommand()) {
      const command = client.commands.user.get(interaction.commandName);
      if (!command) return;
      try {
        command.execute(client, interaction);
      } catch (err) {
        logger.error(err, "User Command");
      }
    } else if (interaction.isButton()) {
      const command = client.components.button.get(interaction.customId);
      if (!command) return;
      try {
        command.execute(client, interaction);
      } catch (err) {
        logger.error(err, "Button Interaction");
      }
    } else {
      return;
    }
  },
};
