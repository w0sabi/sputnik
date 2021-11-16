const sys = require('../sys.js');
module.exports = {
    name: 'reboot',
    description: 'Hopefully never used so i can keep control.',
    execute(message, args) {
        let discord_id = message.author.id;
        sys.db.query("SELECT * FROM accounts WHERE permissions LIKE '%sputnik%' AND discord_id = '" + discord_id + "'", function(err, result) {
            if(result.length > 0) {
                sys.embed(message,'Neustart','Neustart des Bots wird ausgeführt. Bitte warten..',sys.config.COLORS.DANGER);
                setTimeout(function() {sys.reboot()},5000);
            } else {
                sys.embed(message,'Fehler','Du hast keine Rechte für diesen Befehl.',sys.config.COLORS.DANGER)
            }
        });
    },
};
