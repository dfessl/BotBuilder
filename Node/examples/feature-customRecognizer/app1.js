/*-----------------------------------------------------------------------------
This Bot demonstrates how to register a custom Intent Recognizer that will be
run for every message recieved from the user. Custom recognizers can return a 
named intent that can be used to trigger actions and dialogs within the bot.

This specific example adds a recognizer that looks for the user to say 'help'
or 'goodbye' but you could easily add a recognizer that looks for the user to 
send an image or calls some external web service to determine the users intent.

# RUN THE BOT:

    Run the bot from the command line using "node app.js" and then type 
    "hello" to wake the bot up.
    
-----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var builder = require('../../core/');
var restify = require('restify');

var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});


// Setup bot and default message handler
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector,
    function (session) {
        session.sendTyping();
    	setTimeout(function () {
            session.send("You said: '%s'. Try asking for 'help' or say 'goodbye' to quit", session.message.text);
        }, 3000);
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Install a custom recognizer to look for user saying 'help' or 'goodbye'.
bot.recognizer({
    recognize: function (context, done) {
        var intent = { score: 0.0 };
        if (context.message.text) {
            switch (context.message.text.toLowerCase()) {
                case 'help':
                    intent = { score: 1.0, intent: 'Help' };
                    break;
                case 'goodbye':
                    intent = { score: 1.0, intent: 'Goodbye' };
                    break;
            }
        }
        done(null, intent);
    }
});

// Add help dialog with a trigger action bound to the 'Help' intent
bot.dialog('helpDialog', function (session) {
    session.sendTyping();
    setTimeout(function () {
        session.endDialog("You will not find help. Say 'goodbye' to quit.");
    }, 3000);
}).triggerAction({ matches: 'Help' });

// Add global endConversation() action bound to the 'Goodbye' intent
bot.endConversationAction('goodbyeAction', "Ok... See you later.", { matches: 'Goodbye' });

