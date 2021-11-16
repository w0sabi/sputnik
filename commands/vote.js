const sys = require('../sys.js');
module.exports = {
    name: 'vote',
    description: 'For undemocratic elections and votings. Would never use it lol.',
    execute(message, args) {
        let discord_id = message.author.id;
        sys.db.query("SELECT * FROM accounts WHERE permissions LIKE '%sputnik%' AND discord_id = '" + discord_id + "'", function(err, result) {
            if(err) throw err;
            if(result.length > 0) {

                if(!args.length) {
                    sys.embed(message,'Bitte benutze den Befehl wie folgt:','```+vote FRAGE/THEMA```',sys.config.COLORS.INFO);
                } else {
                    sys.embed(message,'Dieser Comand ist aktuell kaputt.','',sys.config.COLORS.SUCCESS);
                    //sys.msgToChn(sys.config.VOTE_CHANNEL,sys.rawEmbed(args.join(" "),'Stimme mit den Pfeilen ab.',sys.config.COLORS.INFO));
                }

            } else {
                sys.embed(message,'Fehler','Du hast keine Rechte für diesen Befehl.',sys.config.COLORS.DANGER)
            }
        });
    },
};
