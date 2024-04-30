const { readdirSync } = require("fs");

module.exports = (client) => {
  const { logger } = client;

  /* ----------> BUTTON HANDLER <---------- */
  readdirSync("./src/components/buttons").forEach((dir) => {
    const buttonFiles = readdirSync(`./src/components/buttons/${dir}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of buttonFiles) {
      const button = require(`../components/buttons/${dir}/${file}`);
      if (button.id) {
        client.components.button.set(button.id, button);
      } else {
        logger.error(`could not find button id in ${file}`, "CLIENT");
      }
    }
  });

  /* ----------> SELECT MENU HANDLER <---------- */
  readdirSync("./src/components/menus").forEach((dir) => {
    const menuFiles = readdirSync(`./bot/components/menus/${dir}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of menuFiles) {
      const menu = require(`@bot/components/menus/${dir}/${file}`);
      if (menu && menu.id) {
        client.menus.set(menu.id, menu);
      } else {
        logger.error(`could not find menu id in ${file}`, "CLIENT");
      }
    }
  });

  /* ----------> MODAL HANDLER <---------- */
  readdirSync("./bot/components/modals").forEach((dir) => {
    const modalFile = readdirSync(`./bot/components/modals/${dir}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of modalFile) {
      const modal = require(`@bot/components/modals/${dir}/${file}`);
      if (modal && modal.id) {
        client.modals.set(modal.id, modal);
      } else {
        logger.error(`could not find nodal id in ${file}`, "CLIENT");
      }
    }
  });
};
