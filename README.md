# monit
Sonde automatique de monitoring

## Installation
`git clone https://github.com/Ziggornif/monit.git`

`npm install`

### Configuration
La configuration de monit est modifiable dans le dossier config.

#### Personnaliser le nom de la machine
Dans le fichier `config.js`, changer la valeur suivante : 
`name: "monit"`

#### Configration des jobs cron
Monit utilise la librairie node-cron pour créer des jobs cron (https://www.npmjs.com/package/node-cron).

Il est possible de modifier le lancement des jobs crons dans le dossier cron.
* name: le nom du job
* cronTime: interval de lancement du job (5 minutes par défaut)
* active: option permettant d'activer ou de désactiver le job

#### Paramétrage spécifique au job sysinfos
* acquisition: paramétrage du stockage des données
    * active: option permetant d'activer ou non les données cpu et mémoire relevées
    * db: fichier json servant de bdd (cf: lowdb https://www.npmjs.com/package/lowdb)
* alerte: paramétrage de l'envoi d'alertes par mail
    * active: option permettant d'activer ou non l'envoi d'alertes
    * resendafter: interval de temps après lequel une nouvelle alerte sera envoyée, si la machine monitorée est toujours dans un état critique
* metrics: définition des seuils critiques
    * cpucritic: seuil critique cpu
    * memcritic: seuil critique mémoire

Exemple :
``` javascript
module.exports = {
    name: "sysinfos",
    cronTime: "*/5 * * * *",
    active: true,
    acquisition: {
        active: true,
        db: __base + "/data/monit.json"
    },
    alerte: {
        active: true,
        resendafter: "1200000"
    },
    metrics: {
        cpucritic: 75,
        memcritic: 75
    }
}
```

#### Configration de l'envoi de mail
Pour que l'envoi de mail soit effectif, il faut renseigner les données suivantes dans `config/mails/mail.js`:
* host: serveur smtp d'envoi de mail
* port: port utilisé par le serveur smtp
* auth: données d'authentification utiilsateur
    * user: le compte utilisateur
    * pass: mot de passe du compte
* contacts: la liste des destinataires qui vont recevoir les alertes

Pour un paramétrage spécifique à votre configuration, veuillez vous référer à la doc officielle : https://nodemailer.com/about/

#### Modification des templates de mail
Les mails envoyés par monit sont générés à partir de templates.
Ils sont modifiables dans `config/mails/templates.json`.

Exemple de template : 
``` json
"report" : {
        "subject": "Rapport hebdomadaire de <%= name %>",
        "html" : "<p>Rapport hebdomadaire de <%= name %></p> <p>Consomation moyenne cpu : <%= cpumoy %>%</p> <p>Pic cpu atteint : <%= cpumax %>%</p> <p>Consomation moyenne mémoire : <%= memmoy %>%</p> <p>Pic mémoire atteint : <%= memmax %>%</p> <p>Nombre d'alertes levées : <%= nbalerts %></p>",
        "text" : "Rapport hebdomadaire de <%= name %> \nConsomation moyenne cpu : <%= cpumoy %>% \nPic cpu atteint : <%= cpumax %>% \nConsomation moyenne mémoire : <%= memmoy %>% \nPic mémoire atteint : <%= memmax %>% \nNombre d'alertes levées : <%= nbalerts %>"
}
```