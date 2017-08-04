var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    //function (session) {
	//	session.send("This is a test");
		//session.beginDialog('goodDay');
	//},
	 function (session) {
        session.send("You can easily send pictures to a user...");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://localhost:4500/test.png"
            }]);
        session.endDialog(msg);
    }
]);
/*bot.dialog('goodDay', [
    // Step 1
    function (session) {
		 session.sendTyping();
    	setTimeout(function () {
			builder.Prompts.choice(session, "How was your day?", "good|bad", builder.ListStyle.auto);
		}, 3000);
    },
	   function (session, results) {
		   if (results.index = "0"){
			     var card = new builder.HeroCard(session)
            		.title("Plot")
            		.text("Test.")
            		.images([
                		 builder.CardImage.create(session, "C:\Users\dfessl\Desktop\News-Bot-Test\python_server\test.png")
           	 ]);
		   } else {
				session.beginDialog('day');
		   }
	   }
]);

bot.dialog('day', [
	function (session) {


	}
]);*/


	/*function (session, results) {
        session.send("Smiley");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/A_Smiley.jpg"
            }]);
        session.endDialog(msg);
	},*/