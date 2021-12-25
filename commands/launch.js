const sys = require('../sys.js');
module.exports = {
    name: 'launch',
    description: 'Next Rocket Launches',
    execute(message, args) {
        if(!args.length) {
            sys.getNextLaunches(3,'',function(result) {
                result = result['result'];
                result.forEach(function myFunction(item, index) {
                    var date = new Date(result[index]['sort_date'] * 1000);
                    var fulltime = date.toLocaleString() + " MEZ";
                    if(result[index]['win_open'] === null) {
                        result[index]['win_open'] = "Folgt";
                        fulltime = "Folgt"
                    }
                    sys.embed(message,result[index]['name'],'Startfenster: ' + fulltime + '\nProvider: ' + result[index]['provider']['name'] + '\nRakete: ' + result[index]['vehicle']['name'],sys.config.COLORS.DEFAULT,'https://www.rocketlaunch.live/launch/' + result[index]['slug'])
                });
            });
        } else {
            sys.getNextLaunches(3,args[0],function(result) {
                result = result['result'];
                if(result.length > 0) {
                    result.forEach(function myFunction(item, index) {
                        if(result[index]['win_open'] === null) {
                            result[index]['win_open'] = "Folgt"
                        }
                        sys.embed(message,result[index]['name'],'Startfenster: ' + result[index]['win_open'] + '\nProvider: ' + result[index]['provider']['name'] + '\nRakete: ' + result[index]['vehicle']['name'],sys.config.COLORS.DEFAULT,'https://www.rocketlaunch.live/launch/' + result[index]['slug'])
                    });
                } else {
                    sys.embed(message,'Keine Raketenstarts gefunden.','Wir konnte keine Ergebnisse für "' + args[0] + '" finden.',sys.config.COLORS.DANGER);
                }
            });
        }
    },
};
