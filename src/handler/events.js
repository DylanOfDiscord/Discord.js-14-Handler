const { readdirSync } = require('fs')

module.exports = (client) => {
    readdirSync('./src/events').map((file) => {
        const events = require(`../events/${file}`);
        client.consoleColor.info(`Events: Loaded ${events.name}`);
        if (events.once) {
            client.once(events.name, (...args) => events.execute(client, ...args));
        } else {
            client.on(events.name, (...args) => events.execute(client, ...args));
        }
    })
}