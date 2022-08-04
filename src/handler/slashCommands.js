const { readdirSync } = require('fs');
const { PermissionsBitField, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const consoleColor = require('../consoleColor')

module.exports = (client) => {
    const data = [];
    let count = 0;
    readdirSync("./src/slashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./src/slashCommands/${dir}/`).filter((files) => files.endsWith(".js"));

        for (const file of slashCommandFile) {
            const slashCommand = require(`../slashCommands/${dir}/${file}`);

            if (!slashCommand.name) return console.error(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);
            if (!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);

            client.slashCommands.set(slashCommand.name, slashCommand);

            data.push({
                name: slashCommand.name,
                description: slashCommand.description,
                type: slashCommand.type,
                options: slashCommand.options ? slashCommand.options : null,
                default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
				default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
            });
            count++;
        }
    });
    client.consoleColor.info(`Client SlashCommands Command (/) Loaded: ${count}`, "cmd");
    const rest = new REST({ version: '10' }).setToken(client ? process.env.TOKEN : process.env.TOKEN);
    (async () => {
        try {
            client.consoleColor.info('Started refreshing application (/) commands.', 'cmd');
            await rest.put(Routes.applicationCommands(client ? client.config.clientID : client.config.clientID), { body: data });
            client.consoleColor.info('Successfully reloaded application (/) commands.', 'cmd');
        } catch (error) {
            console.error(error);
        }
    })();
}

// Code By: WearTIme
// Constributor: Reyhan OP
