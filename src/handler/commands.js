const { readdirSync } = require('fs')

module.exports = (client) => {
    readdirSync('./src/commands').map((dir) =>{
        const commandFiles = readdirSync(`./src/commands/${dir}/`).filter((file) => file.endsWith('.js'))
        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`)
    
            if(command.name) {
                client.commands.set(command.name, command);
                client.consoleColor.info(`Command : loaded ${command.name}`);
                if (command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach(alias => {
                        client.aliases.set(alias, command.name)
                    })
                }
            }
        }
    });
}

// Code By: WearTIme
// Constributor: Reyhan OP