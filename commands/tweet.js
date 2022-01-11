const sys = require('../sys.js');
module.exports = {
    name: 'tweet',
    description: 'Create new tweets for the archive.',
    execute(message, args) {
        sys.checkUserPermissions(message.author.id,message.guild.id,'tweet', function(result) {
            if(result['has_permission'] === true) {
                if(!args.length) {
                    sys.embed(message,'Bitte benutze den Befehl wie folgt:','```+tweet [TWEET_ID] [TAGS (mehrere mit Komma trennen)]```',sys.config.COLORS.INFO);
                } else {
                    sys.createTweet(args[0],args.join(),message.author.id);
                    sys.reply(message,'Erledigt Chef!')
                }
            } else {
                sys.embed(message,'Fehler','Du hast keine Rechte für diesen Befehl.',sys.config.COLORS.DANGER)
            }
        });
    },
};
