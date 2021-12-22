const fs = require('fs');
const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const sys = require('./sys.js');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const presences = [
    "mit Mondgestein",
    "mit einer Radionuklidbatterie",
    "mit den Ventilen von Starliner",
    "wenhop?",
    "Kerbal Space Program",
    "Fußball mit Asteroiden",
    "Frisbee mit der flachen Erde",
    "Fangen mit Percy",
    "mit seinen Antennen",
    "mit Weltraumschrott",
    "Sterneraten mit Voyager 2",
    "Kometenjagen mit Rosetta",
    "Schach mit Juri Gagarin",
    "Verstecken mit Sojourner"
];

/* Functions */

function log(s) {
    if ('undefined' !== typeof console) {
        d = new Date();
        hours = d.getHours();
        if(hours < 10)
            hours = "0" + hours;
        minutes = d.getMinutes();
        if(minutes < 10)
            minutes = "0" + minutes;
        seconds = d.getSeconds();
        if(seconds < 10)
            seconds = "0" + seconds;
        console.log(hours + ':' + minutes + ':' + seconds + ' | SPUTNIK > ' + s);
    }
}

function setStatus() {
    var status = presences[Math.floor(Math.random() * presences.length)];
    client.user.setActivity(status);
    sys.log("Status changes to '" + status + "'")
}

function dbKeepAlive() {
    let sql = "SELECT * FROM server LIMIT 1";
    sys.db.query(sql, function(err, result) {
        if(err) throw err;
        if(result) {
            log('Database keep alive performed.')
        } else {
            log('Database keep alive failed.')
        }
    });
}

/* Intervals */

setInterval(setStatus, 60000);
setInterval(dbKeepAlive, 120000);

/* Client */

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    sys.db.connect(function(err) {
        if (err) throw err;
        sys.log('Database connection established.')
    });
    setStatus();
    const guild = client.guilds.cache.get(config.GUILD_ID);
    guild.members.fetch().then(members => {
        members.forEach(member => {
            sys.userExists(member.id,member.guild.id);
        });
    });
    const channel = client.channels.cache.get(sys.config.ADMIN_CHANNEL);
    if(sys.config.STARTUP_MSG) {
        channel.send(sys.rawEmbed('Beep Boop Beep? 🤖','Antennen ausgerichtet und Systeme vollständig hochgefahren.',sys.config.COLORS.SUCCESS));
    }
    sys.log('Start up process complete.');
});

client.on('guildMemberAdd', member => {
    sys.userExists(member.id,member.guild.id);
    const channel = member.guild.channels.cache.find(ch => ch.name === sys.config.WELCOME_CHANNEL);
    if (!channel) return;
    channel.send(`Willkommen auf dem Senkrechtstarter Discord, ${member}. Du bist Nutzer #${message.guild.memberCount}`);
});

client.on("message", function(message) {

    sys.userExists(message.author.id,message.guild.id);
    sys.logMsg(message.uid,message.author.uid,message.guild.id,message.channel.id,message.content);
    if (!message.content.startsWith(config.PREFIX) || message.author.bot) return;

    if(sys.config.DEBUG) {
        sys.embed(message,'Debug Daten','Channel ID: ' + message.channel.id + "\n" + 'User Request ID: ' + message.author.id,config.COLORS.INFO);
    }

    const args = message.content.slice(config.PREFIX.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    sys.log('User ' + message.author.id + " requested command: " + command);

    if (!client.commands.has(command)) {
        sys.log('Unbekannter Befehl.');
        return sys.msg(message,'Dieser Befehl existiert nicht.');
    }

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        sys.log(error);
        sys.msg(message,'Ein Fehler ist aufgetreten.');
    }

});

client.login(config.BOT_TOKEN);
