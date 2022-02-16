const sys = require('../sys.js');
module.exports = {
    name: 'launch',
    description: 'Next Rocket Launches',
    execute(message, args) {
        if(!args.length) {
            sys.getNextLaunches(3,'',function(result) {
                result = result['upcoming'];
                result.forEach(function myFunction(item, index) {
                    var date = new Date(result[index]['sort_date'] * 1000);
                    var fulltime = date.toLocaleString() + " MEZ";
                    if(result[index]['win_open'] === null) {
                        result[index]['win_open'] = "Folgt";
                        fulltime = "Folgt"
                    }
                    sys.embed(message,result[index]['name'],'Startfenster: ' + fulltime + '\nProvider: ' + result[index]['provider'] + '\nRakete: ' + result[index]['vehicle'],sys.config.COLORS.DEFAULT,'https://orbyte.tv/launch/' + result[index]['slug'])
                });
            });
        } else {
            sys.getNextLaunches(3,args[0],function(result) {
                result = result['upcoming'];
                if(result.length > 0) {
                    result.forEach(function myFunction(item, index) {
                        var date = new Date(result[index]['sort_date'] * 1000);
                        var fulltime = date.toLocaleString() + " MEZ";
                        if(result[index]['win_open'] === null) {
                            result[index]['win_open'] = "Folgt";
                            fulltime = "Folgt"
                        }
                        sys.embed(message,result[index]['name'],'Startfenster: ' + fulltime + '\nProvider: ' + result[index]['provider'] + '\nRakete: ' + result[index]['vehicle'],sys.config.COLORS.DEFAULT,'https://orbyte.tv/launch/' + result[index]['slug'])
                    });
                } else {
                    sys.embed(message,'Keine Raketenstarts gefunden.','Wir konnte keine Ergebnisse für "' + args[0] + '" finden.',sys.config.COLORS.DANGER);
                }
            });
        }
    },
};
