var restify = require('restify');
var builder = require('../../core/');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
bot.set('localizerSettings', {
    defaultLocale: "es"
});
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Middleware
//=========================================================

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        let options = {
            listStyle : builder.ListStyle['button'],
            allowPartialMatches: true,
            recognizeChoices: true
        };
        
        builder.Prompts.choice(session, '¿Qué quieres hacer? Presiona el botón de la opción que necesites.',
            [
                'Sí',
                'No',
                'Dónde'
            ], options);
    },
    function (session, results) {
        session.send('Option selected: '+ results.response.index)
    },
]);