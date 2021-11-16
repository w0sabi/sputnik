const Discord = require("discord.js");
const client = new Discord.Client();
const mysql = require("mysql");
const Crawler = require("crawler");
module.exports = {
    db: mysql.createConnection({
        host: "core.hor1zon.io",
        user: "rw_web",
        password: "C@7fRak!MPoov9p@@Zn4wDeRy7b8Hiz.e-qXgTCxmATRB7kYdg",
        database: "rw_public"
    }),
    config: require("./config.json"),
    msg: function(message,content) {
        message.channel.send(content);
    },
    msgToChn: function(id,content) {
        const msgchannel = client.channels.cache.get(id);
        msgchannel.send(content);
    },
    embed: function (message,title,content,color,url) {
        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setURL(url)
            .setDescription(content);
        this.msg(message,embed);
    },
    rawEmbed: function (title,content,color,url) {
        let output = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setURL(url)
            .setDescription(content);
        return output;
    },
    log: function(s) {
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
    },
    getTimestamp: function() {
        return Math.floor(+new Date() / 1000);
    },
    getRemainingTime: function (timestamp) {
        let countDownDate = new Date(timestamp * 1000).getTime();
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        return days + " Tage " + hours + " Stunden " + minutes + " Minuten " + seconds + " Sekunden";
    },
    stripTags: function(content) {
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
    },
    reboot: function() {
        process.exit();
    },
    crawl: function (message,url) {
        var Crawler = require("crawler");
        output = "";
        var c = new Crawler({
            maxConnections : 10,
            encoding: null,
            callback : function (error, res, done) {
                var $ = res.$;
                output = String($("html").html());
                done();
            }
        });
        this.msg(message,output);
        c.queue("https://rocketweek.net/");
    }
};
