const Discord = require("discord.js");
const client = new Discord.Client();
const mysql = require("mysql");
const Crawler = require("crawler");
const axios = require("axios");
var FormData = require('form-data');
var fs = require('fs');
var http = require('http');

module.exports = {
    db: mysql.createConnection({
        host: "core.hor1zon.io",
        user: "sputnik_bot",
        password: "D_vZBiokHfz!jckC*h7GUftgo9QdR3aMMn_!knBuEm!J7.mCEu",
        database: "sputnik"
    }),
    config: require("./config.json"),
    userExists: function(uid,server_id) {
        axios({
            method: 'GET',
            url: 'https://api.orbyte.tv/auth/user/create?uid=' + uid + '&server_id=' + server_id + '&key=QrbV8hMnkLxvaYKZJQbmNDLVEsPtqqwg'
        })
            .then(function (response) {
                //console.log("User" + uid + " created in database.")
            })
            .catch(function (error) {
                console.log("An error occured:");
                console.log('HTTP error:' + error);
            });
    },
    logMsg: function(uid,author_uid,server_id,channel_id,content) {
        axios({
            method: 'GET',
            url: 'https://api.orbyte.tv/interaction/message/log?uid=' + uid + '&server_id=' + server_id + '&author_uid=' + author_uid + '&channel_id=' + channel_id + '&content=' + content + '&key=QrbV8hMnkLxvaYKZJQbmNDLVEsPtqqwg'
        })
            .then(function (response) {
                
            })
            .catch(function (error) {
                console.log("An error occured:");
                console.log('HTTP error:' + error);
            });
    },
    getWikiArticle: function(query, callback) {
        axios({
            method: 'GET',
            url: 'https://raumfahrt-forum.de/search.json?q=' + query + ' category:wiki'
        })
            .then(function (response) {
                callback(response.data);
            })
            .catch(function (error) {
                console.log("An error occured:");
                console.log('HTTP error:' + error);
            });
    },
    checkUserPermissions: function(uid,server_id,permission, callback) {
        axios({
            method: 'GET',
            url: 'https://api.orbyte.tv/auth/user/permission?uid=' + uid + '&server_id=' + server_id + '&permission=' + permission + '&key=QrbV8hMnkLxvaYKZJQbmNDLVEsPtqqwg'
        })
            .then(function (response) {
                callback(response.data);
            })
            .catch(function (error) {
                console.log("An error occured:");
                console.log('HTTP error:' + error);
            });
    },
    getNextLaunches: function(limit,query,callback) {
        axios({
            method: 'GET',
            url: 'https://fdo.rocketlaunch.live/json/launches?key=b8d148d6-b4c8-4736-b2f3-f3121410e647&limit=' + limit + '&search=' + query
        })
            .then(function (response) {
                callback(response.data);
            })
            .catch(function (error) {
                console.log("An error occured:");
                console.log('HTTP error:' + error);
            });
    },
    createTweet: function(tweet_id,tags,author) {
        axios({
            method: 'GET',
            url: 'https://api.orbyte.tv/post/tweet?tweet_id=' + tweet_id + '&tags=' + tags + '&author=' + author
        })
            .then(function (response) {
                callback(response.data);
            })
            .catch(function (error) {
                console.log("An error occured:");
                console.log('HTTP error:' + error);
            });
    },
    msg: function(message,content,reactions) {
        message.channel.send(content).then(sendMessage => {
            if(reactions) {
                reactions.forEach(function myFunction(item) {
                    sendMessage.react(item);
                });
            }
        });
    },
    reply: function(message,content) {
      message.reply(content);
    },
    msgToChn: function(id,content) {
        const msgchannel = client.channels.cache.get(id);
        msgchannel.send(content);
    },
    embed: function (message,title,content,color,url,reactions) {
        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setURL(url)
            .setDescription(content);
        this.msg(message,embed,reactions);
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
    }
};
