const { Schema, model } = require('mongoose');

const guild = new Schema({
    guildId: String,
    prefix: String,
});

module.exports = model('guilds', guild);