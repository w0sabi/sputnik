const sys = require('../sys.js');
module.exports = {
    name: 'wiki',
    description: 'Unlimited power. And knowledge. Muhahaha.',
    execute(message, args) {
        if(!args.length) {
            sys.embed(message,'Wie können wir dir helfen?','Bitte benutze den Command so: ```+wiki KEYWORD```',sys.config.COLORS.INFO);
        } else {
            sys.getWikiArticle(args[0], function(result) {
                result = result['topics'];
                if(typeof result != "undefined") {
                    result.forEach(function myFunction(item, index) {
                        sys.embed(message,result[index]['title'],'Letztes Update: ' + result[index]['last_posted_at'],sys.config.COLORS.DEFAULT,'https://raumfahrt-forum.de/t/' + result[index]['slug'])
                    });
                } else {
                    sys.embed(message,'Kein Suchergebnis gefunden','Wir konnten keinen Eintrag zu dem Begriff "' + args[0] + '" finden.',sys.config.COLORS.DANGER);
                }
            });
        }
    },
};
