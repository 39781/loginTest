var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	


const {WebhookClient} = require('dialogflow-fulfillment');
const {Text, Card, Suggestion} = require('dialogflow-fulfillment');
const { SimpleResponse } =require('actions-on-google');

var agents ={};


router.get('/',function(req,res){
	res.redirect('login.html');
})

router.post('/botHandler',function(req, res){		
	/*reqs[req.body.originalDetectIntentRequest.payload.conversation.conversationId]={}
	reqs[req.body.originalDetectIntentRequest.payload.conversation.conversationId]['req']=req;	
	reqs[req.body.originalDetectIntentRequest.payload.conversation.conversationId]['res']=res;*/
	var resp = JSON.parse(JSON.stringify(config.responseObj));	
	fireResponse(req, res);
});	

var fireResponse = function(req, res){
	var convID = req.body.originalDetectIntentRequest.payload.conversation.conversationId;
	agents[convID] = new WebhookClient({ request:req, response:res });  
	let intentMap = new Map();	
	intentMap.set('Default Welcome Intent', welcome);
	intentMap.set('loginSuccess', loginSuccess);
	agents[convID].handleRequest(intentMap);
}

router.post('/validateUser',function(req, res){
	console.log(JSON.stringify(req.body));
	dialogflowAPI('login sucess',req.body.sess);
	//agents[req.body.sess].setFollowupEvent({'name':'loginSuccess','parameters':{}});
	//fireResponse(reqs[req.body.sess]['req'],reqs[req.body.sess]['res']);
	res.end();
})

var dialogflowAPI = function(input, sessId){		
	var options = { 
		method: 'POST',
		url: config.dialogflowAPI,
		headers: {
			"Authorization": "Bearer " + config.accessToken
		},
		body:{
			sessionId: sessId,
			lang: "en",
			query:input
		},			
		json: true 
	}; 					
	request(options, function (error, response, body) {
		if(error){
			return error;
		}else{						
			return body;
		}		
	});				
}


var welcome = function(agent){
	console.log('hari',agent.request_.body.originalDetectIntentRequest.payload.conversation.conversationId);
	agent.add(new Text({'text': `Welcome to my agent!`, 'ssml': `<speak>Hi<break time='5s'/>Welcome to my agent</speak>` }));
	agent.add(new Card({
	 title: `Menus`,
	 imageUrl: '',
	 text: ``,
	 buttonText: 'Login',
	 buttonUrl: 'https://logintests.herokuapp.com/login.html?sessId='+agent.request_.body.originalDetectIntentRequest.payload.conversation.conversationId
   })
 );
}

var loginSuccess = function(agent){
     agent.add(`user validation sucess`);
     agent.add(new Card({
         title: `Menus`,
         imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
         text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
         buttonText: 'This is a button',
         buttonUrl: 'https://assistant.google.com/'
       })
     );
   //  agent.add(new Suggestion(`Quick Reply`));
    // agent.add(new Suggestion(`Suggestion`));
     //agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});   
}



module.exports = router;





