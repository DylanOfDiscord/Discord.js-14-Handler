const { readdirSync } = require('fs');
const path = require('node:path');
const {
    Client,
    GatewayIntentBits,
    Options,
    Collection
} = require('discord.js');
const mongoose = require('mongoose');

const client = new Client({
    allowedMentions: {
        repliedUser: false,
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
    ],
    failIfNotExists: true,
    makeCache: Options.cacheWithLimits({
        ApplicationCommandManager: 0,
        BaseGuildEmojiManager: 0,
        GuildBanManager: 0,
        GuildInviteManager: 0,
        GuildStickerManager: 0,
        GuildScheduledEventManager: 0,
        PresenceManager: 0,
        ReactionManager: 0,
        ReactionUserManager: 0,
        StageInstanceManager: 0,
        VoiceStateManager: 0,
    }),
});

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.config = require('./config/config.json');
client.owner = client.config.owner;
client.emojis = require('./config/emoji.json');
client.consoleColor = require('./consoleColor');
require('dotenv').config();

client.rest.on('rateLimited', async (ratelimitData) => {
    client.consoleColor.warn(ratelimitData);
})

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason, promise);
});
  
process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
});
  
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err, origin);
});

const mongoOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,  
}
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI, mongoOption);
mongoose.connection.on('connected', () => {
    client.consoleColor.info('MongoDB connected.');
});
          
mongoose.connection.on('err', (err) => {
    client.consoleColor.error(`MongoDB connection error: \n ${err.stack}`);
});
          
mongoose.connection.on('disconnected', () => {
    client.consoleColor.warn('MongoDB disconnected.');
});

["commands", "events", "slashCommands"].forEach((handler) => {
    require(`./handler/${handler}`)(client);
})

client.login(process.env.TOKEN)
