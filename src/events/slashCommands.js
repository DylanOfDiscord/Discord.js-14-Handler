const { CommandInteraction, Client, InteractionType, PermissionFlagsBits, EmbedBuilder, Collection, PermissionsBitField } = require("discord.js")
const prefixData = require('../models/guild');
const ms = require('ms');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const slashCommand = client.slashCommands.get(interaction.commandName);
		if (interaction.type == 4) {
			if(slashCommand.autocomplete) {
				const choices = [];
				await slashCommand.autocomplete(interaction, choices)
			}
		}

		if (!interaction.type == 2) return;
	
		if(!slashCommand) return client.slashCommands.delete(interaction.commandName);
		try {
			if(slashCommand.cooldown) {
				if(client.cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return interaction.reply({ content: `Please Wait ` + ms(client.cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), {long : true}) + ` To Execute This Command Again` })
				if(slashCommand.userPerms || slashCommand.botPerms) {
					if(!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
						const embedUserPerms = new EmbedBuilder()
						.setDescription(`You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [embedUserPerms] })
					}
					if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
						const embedBotPerms = new EmbedBuilder()
						.setDescription(`I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [embedBotPerms] })
					}

				}

				await slashCommand.run(client, interaction);
				client.cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
				setTimeout(() => {
					client.cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
				}, slashCommand.cooldown)

			} else {
				if(slashCommand.userPerms || slashCommand.botPerms) {
					if(!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
						const userPerms = new EmbedBuilder()
						.setDescription(`You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [userPerms] })
					}
					if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
						const botPerms = new EmbedBuilder()
						.setDescription(`I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [botPerms] })
					}

				}
				await slashCommand.run(client, interaction);
			}
		} catch (error) {
			console.log(error);
		}
    }
}

// Code By: WearTIme
// Constributor: Reyhan OP
