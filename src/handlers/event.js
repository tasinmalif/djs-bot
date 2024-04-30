const { readdirSync } = require("node:fs");

module.exports = (client) => {
  const { logger } = client;
  readdirSync("./src/events/").forEach((folder) => {
    const eventFiles = readdirSync(`./src/events/${folder}`).filter((file) =>
      file.endsWith(".js")
    );
    for (const file of eventFiles) {
      const event = require(`../events/${folder}/${file}`);
      if (event && event.name) {
        client.events.set(event.name, event);
        if (event.once) {
          client.once(event.name, (...args) =>
            event.execute((client = client), ...args)
          );
        } else {
          client.on(event.name, (...args) =>
            event.execute((client = client), ...args)
          );
        }
      } else {
        logger.warn(`could not find event name in ${file}`, ["client", "event"]);
      }
    }
  });
};
