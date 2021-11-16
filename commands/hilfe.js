const sys = require('../sys.js');
module.exports = {
    name: 'hilfe',
    aliases: ['help'],
    description: 'Send help plz..',
    execute(message, args) {
        sys.embed(message,'Hilfe','',sys.config.COLORS.INFO);
    },
};
