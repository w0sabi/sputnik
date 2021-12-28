const sys = require('../sys.js');
module.exports = {
    name: 'lauch',
    description: 'Lauch!',
    execute(message, args) {
        sys.reply(message,'https://media.giphy.com/media/ltwgk1iOXD1w4/giphy.gif');
    },
};
