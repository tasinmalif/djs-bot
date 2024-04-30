const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  async execute(client) {
    client.user.setPresence({
      activities: [
        {
          name: "CHANGE",
          type: ActivityType.Competing,
          state: "CHANGE",
        },
      ],
      status: "online",
    });
    client.logger.put(
      `${client.user.username.toLowerCase()} is online.`,
      "CLIENT"
    );
  },
};
