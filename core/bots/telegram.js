const TelegramBot = require('node-telegram-bot-api');
const config = require(__base+"config/config");
const sysinfos = require(__base+"core/services/sysinfos");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.bots.telegram.token, {
    polling: true
});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    var opts = {
        reply_markup: JSON.stringify({
            keyboard: [
                ['/sysinfos', '/uptime'],
                ['/freemem', '/help']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        })
    };
    switch(msg.text){
        case '/help':
            bot.sendMessage(chatId, 'Liste des commandes :\n/help : liste des commandes disponibles\n/sysinfos : consommation du serveur monitoré\n/uptime : uptime du serveur monitoré', opts);
            break;
        case '/sysinfos':
            sysinfos.getInfos().then(function(result){
                bot.sendMessage(chatId, 'Consommation actuelle de ' + config.name + '\ncpu: ' + result.cpu + '% mem: ' + result.mem + '%.', opts);
            });
            break;
        case '/uptime':
            let uptime = sysinfos.uptime();
            bot.sendMessage(chatId, 'Le serveur est en ligne depuis ' + uptime.days + ' jours ' + uptime.hours + ' heures et ' + uptime.minutes + ' minutes', opts);
            break;
        case '/freemem':
            sysinfos.freecache().then(function(){
                bot.sendMessage(chatId, 'Nettoyage du cache serveur terminé', opts);
            }, function(error){
                bot.sendMessage(chatId, 'Erreur lors du nettoyage du cache serveur', opts);
            });
            break;
        default:
            bot.sendMessage(chatId, 'Commande non trouvée.\n/help pour avoir la liste des commandes disponibles', opts);
    }
});

exports.sendMessage = function(channel, message) {
    bot.sendMessage(channel, message);
}