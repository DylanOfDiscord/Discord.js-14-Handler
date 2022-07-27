const { ActivityType } = require('discord.js');
const consoleColor = require('../consoleColor');

module.exports = {
    name: 'ready',
    execute: async (client) => {
        await client.application.fetch();
        consoleColor.info(`Logged in ${client.user.tag}`);

        client.user.setPresence({
            activities: [
                {
                    name: 'djs v14',
                    type: ActivityType.Competing
                }
            ]
        })
    }
}