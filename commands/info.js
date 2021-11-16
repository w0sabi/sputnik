const sys = require('../sys.js');
module.exports = {
    name: 'info',
    aliases: ['server'],
    description: 'Some stats and useful information.',
    execute(message, args) {
        sys.embed(message,'Server Informationen','Server: **' + message.guild.name  + '**\nInhaber: **' + message.guild.owner.user.tag + '**\nErstellt: **' + message.guild.createdAt.toLocaleString() + '**\nNutzer: **' + message.guild.memberCount + '**\nBots: **' + message.guild.members.filter(m=>m.user.bot).size + '**\nBot-Version: **' + sys.config.VERSION + '**',sys.config.COLORS.INFO);
    },
};
