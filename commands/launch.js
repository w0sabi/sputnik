const sys = require('../sys.js');
module.exports = {
    name: 'launch',
    description: 'Next Rocket Launches',
    execute(message, args) {
        if(!args.length) {
            let sql = "SELECT * FROM launches WHERE launch_time_start >= ? ORDER BY launch_time_start ASC";
            sys.db.query(sql,sys.getTimestamp(), function(err, result) {
                if(err) throw err;
                if(result.length > 0) {
                    sys.embed(message,'Nächster Raketenstart','**' + result[0]['title'] +
                        '**\n\nVerbleibend: **' + sys.getRemainingTime(result[0]['launch_time_start']) + '**.' + '\n\n' + 'Weitere Raketenstarts gibt es hier: https://rocketweek.net/launches',sys.config.COLORS.DEFAULT);
                } else {
                    sys.msg(message,'Wir konnten keinen nächsten Raketenstart finden.');
                }
            });
        } else {
            let sql = "SELECT * FROM launches WHERE (launch_time_start >= ?) AND (provider LIKE '%" + args[0] + "%' OR title LIKE '%" + args[0] + "%') ORDER BY launch_time_start ASC";
            sys.db.query(sql,sys.getTimestamp(), function(err, result) {
                if(err) throw err;
                if(result.length > 0) {
                    sys.embed(message,'Nächster Raketenstart von ' + result[0]['provider'],'**' + result[0]['title'] +
                        '**\n\nVerbleibend: **' + sys.getRemainingTime(result[0]['launch_time_start']) + '**.' + '\n\n' + 'Weitere Raketenstarts gibt es hier: https://rocketweek.net/launches',sys.config.COLORS.DEFAULT);
                } else {
                    sys.embed(message,'Kein Ergebnis','Wir konnten keinen nächsten Raketenstart von "' + args[0] + '" finden.',sys.config.COLORS.DANGER);
                }
            });
        }
    },
};
