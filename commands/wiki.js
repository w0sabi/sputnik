const sys = require('../sys.js');
module.exports = {
    name: 'wiki',
    description: 'Unlimited power. And knowledge. Muhahaha.',
    execute(message, args) {
        if(!args.length) {
            sys.embed(message,'Wie können wir dir helfen?','Bitte benutze den Command so: ```+wiki KEYWORD```',sys.config.COLORS.INFO);
        } else {
            let sql = "SELECT * FROM wiki WHERE title LIKE '%" + args[0] + "%'";
            sys.db.query(sql,sys.getTimestamp(), function(err, result) {
                if(err) throw err;
                if(result.length > 0) {
                    result.forEach(function myFunction(item, index) {
                        sys.embed(message,result[index]['title'],sys.stripTags(result[index]['content']),sys.config.COLORS.DEFAULT,'https://rocketweek.net/wiki/' + result[index]['url'])
                    });
                } else {
                    sys.embed(message,'Kein Suchergebnis gefunden','Wir konnten keinen Eintrag zu dem Begriff "' + args[0] + '" finden.',sys.config.COLORS.DANGER);
                }
            });
        }
    },
};
