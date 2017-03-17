const TelegramBot = require('node-telegram-bot-api');
const config = require(__base+"config/config");
const sysinfos = require(__base+"core/services/sysinfos");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.bots.telegram.token, {
    polling: true
});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    switch(msg.text){
        case '/help':
            bot.sendMessage(chatId, 'Liste des commandes :\n/help : liste des commandes disponibles\n/sysinfos : consommation du serveur monitoré');
            break;
        case '/sysinfos':
            sysinfos.getInfos().then(function(result){
                bot.sendMessage(chatId, 'Consommation actuelle de ' + config.name + '\ncpu: ' + result.cpu + '% mem: ' + result.mem + '%.');
            });
            break;
        default:
            bot.sendMessage(chatId, 'Commande non trouvée.\n/help pour avoir la liste des commandes disponibles');
    }
});

exports.sendMessage = function(channel, message) {
    bot.sendMessage(channel, message);
}