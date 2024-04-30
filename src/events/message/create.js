const {
  Events,
  ChannelType,
  PermissionsBitField,
  Collection,
} = require("discord.js");

const { sendError } = require("../../functions/utility");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  execute: async (client, message) => {
    const { logger, config, cooldowns } = client;
    if (message.author.bot || message.author.system) return;
    if (!message.content.startsWith(config.bot.prefix)) return;
    const [cmd, ...args] = message.content
      .slice(config.bot.prefix.length)
      .trim()
      .split(/ +/g);
    if (cmd.length === 0) return;
    const command =
      client.commands.prefix.get(cmd.toLowerCase()) ||
      client.commands.prefix.find((c) =>
        c.aliases?.includes(cmd.toLowerCase())
      );
    if (!command) return;
    if (command.ownerOnly && message.author.id !== config.bot.ownerId) {
      sendError("This command can only be used by the bot owner.", message);
      return;
    }
    if (command.devOnly && !config.bot.developers.includes(message.author.id)) {
      sendError(
        "This command can only be used by the bot developers.",
        message
      );
      return;
    }
    if (command.guildOnly && !message.guild) {
      sendError("This command can only be used in a server.", message);
      return;
    }
    if (command.dmOnly && message.guild) {
      sendError("This command can only be used in DMs.", message);
      return;
    }
    if (
      message.channel.type !== ChannelType.DM &&
      command.permissions.member.length > 0
    ) {
      const requiredPerms =
        PermissionsBitField.resolve(command.permissions.member).toString() ||
        null;
      if (!message.member.permissions.has(requiredPerms)) {
        sendError(
          "You don't have the required permissions to run this command.",
          message
        );
        return;
      }
    }
    if (
      message.channel.type !== ChannelType.DM &&
      command.permissions.client > 0
    ) {
      const requiredPerms =
        PermissionsBitField.resolve(command.permissions.client).toString() ||
        null;
      if (!me.permissions.has(requiredPerms)) {
        sendError(
          "I don't have the required permissions to run this command.",
          message
        );
        return;
      }
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount =
      (command.cooldown ?? defaultCooldownDuration) * 1_000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        return sendError(
          `\`${command.name}\` command is in cooldown now. Try again in <t:${expiredTimestamp}:R>`,
          message
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(client, message, args);
    } catch (err) {
      logger.error(err, "Prefix Command");
    }
  },
};
