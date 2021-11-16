const sys = require('../sys.js');
module.exports = {
    name: 'crawl',
    aliases: [''],
    description: 'Development shit**',
    execute(message, args) {
        if(args.length) {
            sys.msg(message,'Starting crawl..');
            var res = sys.crawl(message,args[0]);
            sys.embed(message,'Crawling Result',res);
            sys.msg(message,'Crawl finished!');
        } else {
            sys.embed(message,'Fehlende URL!','Bitte gib eine URL die du Crawlen möchtest.',sys.config.COLORS.DANGER)
        }
    },
};
