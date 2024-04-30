const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");

const logger = require("./util/logger");
const config = require("./util/config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [
    Partials.User,
    Partials.GuildMember,
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
  ],
  allowedMentions: {
    repliedUser: false,
  },

  restRequestTimeout: 20000,
});

client.logger = logger;
client.config = config;

client.commands = {
  slash: new Collection(),
  prefix: new Collection(),
  message: new Collection(),
  user: new Collection(),
};

client.components = {
  button: new Collection(),
  menu: new Collection(),
  modal: new Collection(),
};

client.events = new Collection();
client.cooldowns = new Collection();

client.login(process.env.BOT_TOKEN);
