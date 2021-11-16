const config = require("./config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const mysql = require("mysql");
const db = mysql.createConnection({
    host: "core.hor1zon.io",
    user: "rw_web",
    password: "C@7fRak!MPoov9p@@Zn4wDeRy7b8Hiz.e-qXgTCxmATRB7kYdg",
    database: "rw_public"
});
const presences = [
    "mit Mondgestein",
    "mit einer Radionuklidbatterie",
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
}

function getTimestamp() {
    return Math.floor(+new Date() / 1000);
}

function getRemainingTime(timestamp) {
    let countDownDate = new Date(timestamp * 1000).getTime();
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return days + " Tage " + hours + " Stunden " + minutes + " Minuten " + seconds + " Sekunden";
}

function stripTags(content) {
    var output = content.replace(/(<([^>]+)>)/gi, "");
    var output = output.replaceAll("&ouml;", "ö");
    var output = output.replaceAll("&uuml;", "ü");
    var output = output.replaceAll("&auml;", "ä");
    var output = output.replaceAll("&Ouml;", "Ö");
    var output = output.replaceAll("&Uuml;", "Ü");
    var output = output.replaceAll("&Auml;", "Ä");
    var output = output.replaceAll("&szlig;", "ß");
    var output = output.replaceAll("&nbsp;", " ");
    return output;
}

function dbKeepAlive() {
    let sql = "SELECT * FROM wiki LIMIT 1";
    db.query(sql, function(err, result) {
        if(err) throw err;
        if(result) {
            log('Database keep alive performed.')
        } else {
            log('Database keep alive failed.')
        }
    });
}

/* Intervals */

setInterval(setStatus, 30000);
setInterval(dbKeepAlive, 120000);

/* Client */

client.on('ready', () => {
    db.connect(function(err) {
        if (err) throw err;
        log('Database connection established.')
    });
    log('Start up process complete.');
    setStatus();
    let embed = new Discord.MessageEmbed()
        .setTitle('Start Prozess abgeschlossen')
        .setColor(config.COLORS.SUCCESS)
        .setDescription('Der Bot wurde erfolgreich neugestartet.');
    const channel = client.channels.cache.get(config.ADMIN_CHANNEL);
    channel.send(embed);
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === config.WELCOME_CHANNEL);
    if (!channel) return;
    channel.send(`Willkommen auf dem Senkrechtstarter Discord, ${member}. Du bist Nutzer #${message.guild.memberCount}`);
});

client.on("message", function(message) {

    function msg(content) {
        message.channel.send(content);
    }

    function embed(title,content,color,url) {
        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setURL(url)
            .setDescription(content);
        msg(embed);
    }

    function rawEmbed(title,content,color,url) {
        let output = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setURL(url)
            .setDescription(content);
        return output;
    }

    if (!message.content.startsWith(config.PREFIX) || message.author.bot) return;

    if(config.DEBUG) {
        embed('Debug Daten','Channel ID: ' + message.channel.id + "\n" + 'User Request ID: ' + message.author.id,config.COLORS.INFO);
    }

    const args = message.content.slice(config.PREFIX.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    log('User ' + message.author.id + " requested command: " + command);

    if(command === "ping") {
        msg('Pong!');
    } else if(command === "info") {
        embed('Info','Server: **' + message.guild.name + '**\nNutzer: **' + message.guild.memberCount + '**\nBot Version: **' + config.VERSION + '**',config.COLORS.INFO);
    } else if(command === "reboot") {
        let discord_id = message.author.id;
        db.query("SELECT * FROM accounts WHERE permissions LIKE '%sputnik%' AND discord_id = '" + discord_id + "'", function(err, result) {
            if(err) throw err;
            if(result.length > 0) {
                embed('Neustart','Neustart des Bots wird ausgeführt. Bitte warten..',config.COLORS.DANGER);
                setTimeout(function() {process.exit();},5000);
            } else {
                embed('Fehler','Du hast keine Rechte für diesen Befehl.',config.COLORS.DANGER)
            }
        });
    } else if(command === "launch") {
        if(!args.length) {
            let sql = "SELECT * FROM launches WHERE launch_time_start >= ? ORDER BY launch_time_start ASC";
            db.query(sql,getTimestamp(), function(err, result) {
                if(err) throw err;
                if(result.length > 0) {
                    embed('Nächster Raketenstart','**' + result[0]['title'] +
                        '**\n\nVerbleibend: **' + getRemainingTime(result[0]['launch_time_start']) + '**.' + '\n\n' + 'Weitere Raketenstarts gibt es hier: https://rocketweek.net/launches',config.COLORS.DEFAULT);
                } else {
                    msg('Wir konnten keinen nächsten Raketenstart finden.');
                }
            });
        } else {
            let sql = "SELECT * FROM launches WHERE (launch_time_start >= ?) AND (provider LIKE '%" + args[0] + "%' OR title LIKE '%" + args[0] + "%') ORDER BY launch_time_start ASC";
            db.query(sql,getTimestamp(), function(err, result) {
                if(err) throw err;
                if(result.length > 0) {
                    embed('Nächster Raketenstart von ' + result[0]['provider'],'**' + result[0]['title'] +
                        '**\n\nVerbleibend: **' + getRemainingTime(result[0]['launch_time_start']) + '**.' + '\n\n' + 'Weitere Raketenstarts gibt es hier: https://rocketweek.net/launches',config.COLORS.DEFAULT);
                } else {
                    embed('Kein Ergebnis','Wir konnten keinen nächsten Raketenstart von "' + args[0] + '" finden.',config.COLORS.DANGER);
                }
            });
        }
    } else if(command === "wiki") {
        if(!args.length) {
            embed('Wie können wir dir helfen?','Bitte benutze den Command so: ```+wiki KEYWORD```',config.COLORS.INFO);
        } else {
            let sql = "SELECT * FROM wiki WHERE title LIKE '%" + args[0] + "%'";
            db.query(sql,getTimestamp(), function(err, result) {
                if(err) throw err;
                if(result.length > 0) {
                    result.forEach(function myFunction(item, index) {
                        embed(result[index]['title'],stripTags(result[index]['content']),config.COLORS.DEFAULT,'https://rocketweek.net/wiki/' + result[index]['url'])
                    });
                } else {
                    embed('Kein Suchergebnis gefunden','Wir konnten keinen Eintrag zu dem Begriff "' + args[0] + '" finden.',config.COLORS.DANGER);
                }
            });
        }
    } else if(command === "vote") {
        let discord_id = message.author.id;
        db.query("SELECT * FROM accounts WHERE permissions LIKE '%sputnik%' AND discord_id = '" + discord_id + "'", function(err, result) {
            if(err) throw err;
            if(result.length > 0) {

                if(!args.length) {
                    embed('Bitte benutze den Befehl wie folgt:','```+vote FRAGE/THEMA```',config.COLORS.INFO);
                } else {
                    embed('Voting gesendet','',config.COLORS.SUCCESS);
                    const channel = client.channels.cache.get(config.VOTE_CHANNEL);
                    channel.send(rawEmbed(args.join(" "),'Stimme mit den Pfeilen ab.',config.COLORS.INFO)).then(sentMessage => {
                        sentMessage.react('🔼');
                        sentMessage.react('🔽');
                    });
                }

            } else {
                embed('Fehler','Du hast keine Rechte für diesen Befehl.',config.COLORS.DANGER)
            }
        });
    }

});

client.login(config.BOT_TOKEN);
