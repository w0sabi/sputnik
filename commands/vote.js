const sys = require('../sys.js');
module.exports = {
    name: 'vote',
    description: 'For undemocratic elections and votings. Would never use it lol.',
    execute(message, args) {
        sys.checkUserPermissions(message.author.id,message.guild.id,'vote', function(result) {
            if(result['has_permission'] === true) {
                if(!args.length) {
                    sys.embed(message,'Bitte benutze den Befehl wie folgt:','```+vote FRAGE/THEMA```',sys.config.COLORS.INFO);
                } else {
                    sys.embed(message,args.join(" "),'Stimme mit den Pfeilen ab.',sys.config.COLORS.INFO,null,["🔼","🔽"]);
                }
            } else {
                sys.embed(message,'Fehler','Du hast keine Rechte für diesen Befehl.',sys.config.COLORS.DANGER)
            }
        });
    },
};
