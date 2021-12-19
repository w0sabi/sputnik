const sys = require('../sys.js');
module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
        sys.reply(message,'Pong. 🏓');
    },
};
