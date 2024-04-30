const { Routes, REST, PermissionsBitField } = require("discord.js");
const { readdirSync } = require("node:fs");

module.exports = (client) => {
  const commands = [];
  const { logger, config } = client;

  /* ----------> PREFIX COMMANDS <---------- */
  readdirSync("./src/commands/prefix/").forEach((folder) => {
    const commandFiles = readdirSync(`./src/commands/prefix/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of commandFiles) {
      const command = require(`../commands/prefix/${folder}/${file}`);
      if (command && command.name) {
        client.commands.prefix.set(command.name, command);
      } else {
        logger.error(`could not find command name in ${file}`, "CLIENT");
      }
    }
  });

  /* ----------> SLASH COMMANDS <---------- */
  readdirSync("./src/commands/slash").forEach((folder) => {
    const commandFiles = readdirSync(`./src/commands/slash/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of commandFiles) {
      const command = require(`../commands/slash/${folder}/${file}`);
      if (command && command.name && command.description && command.type == 1) {
        client.commands.slash.set(command.name, command);
        commands.push({
          name: command.name,
          description: command.description,
          type: command.type || 1,
          options: command.options ?? null,
          default_member_permissions: command.permissions
            ? PermissionsBitField.resolve(command.permissions).toString()
            : null,
        });
      } else {
        logger.warn(
          `missing one or more required parameters in ${file}`,
          "slash",
          false
        );
        continue;
      }
    }
  });

  /* ----------> USER COMMANDS <---------- */
  readdirSync("./src/commands/user/").forEach((folder) => {
    const commandFiles = readdirSync(`./src/commands/user/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of commandFiles) {
      const command = require(`../commands/user/${folder}/${file}`);
      if (command && command.name && command.type == 2) {
        client.commands.user.set(command.name, command);
        commands.push({
          name: command.name,
          type: command.type || 2,
        });
      } else {
        logger.warn(
          `missing one or more required parameters in ${file}`,
          "USER"
        );
        continue;
      }
    }
  });

  /* ----------> MESSAGE COMMANDS <---------- */
  readdirSync("./src/commands/message/").forEach((folder) => {
    const commandFiles = readdirSync(`./src/commands/message/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of commandFiles) {
      const command = require(`../commands/message/${folder}/${file}`);
      if (command && command.name && command.type == 3) {
        client.commands.message.set(command.name, command);
        commands.push({
          name: command.name,
          type: command.type || 3,
        });
      } else {
        logger.warn(
          `missing one or more required parameters in ${file}`,
          "message"
        );
        continue;
      }
    }
  });

  /* ----------> REGISTER COMMANDS <---------- */
  const rest = new REST({ version: "10" }).setToken(config.bot.token);
  (async () => {
    try {
      if (config.settings.developer_mode) {
        logger.info("Developer mode enabled", "client");
        var data = await rest.put(
          Routes.applicationGuildCommands(config.bot.id, config.bot.guild),
          {
            body: [],
          }
        );
      } else {
        logger.info("Developer mode disabled", "client");
        data = await rest.put(
          Routes.applicationCommands(client.config.bot.id),
          {
            body: commands,
          }
        );
      }
      logger.info(
        `${data.length} slash commands reloaded succesfully.`,
        "client"
      );
    } catch (err) {
      logger.error(err, "client");
    }
  })();
};
