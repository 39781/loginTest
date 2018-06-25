var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	

var currentSession;
//const {WebhookClient} = require('dialogflow-fulfillment');
//const {Card, Suggestion} = require('dialogflow-fulfillment');
const { dialogflow } = require('actions-on-google');
const { SimpleResponse } =require('actions-on-google');
var Otps ={};
router.get('/',function(req,res){
	res.redirect('login.html');
})

router.post('/botHandler',(req,res)=>processWebhook(req, res));		
	/*simpleResponse(resp,"Hi I'm Hema !. I can help you to manage your leaves,search an employee, account recovery and create or track your service tickets. Please login to begin.")
	.then(function(result){		
		var buttons= [
              {
                "title": "Login",
                "openUrlAction": {
                  "url": "https://logintests.herokuapp.com/login.html"
                }
              }
            ]
		return basicCard(result,"Please login to help you.",buttons)
	})
	.then(function(result){
		console.log(result);
		res.json(result).end();
	});*/	
var processWebhook = function(request, response){
	const app = dialogflow()
	app.intent('Default Welcome Intent', conv => {
  conv.ask('Hi, how is it going?')
  conv.ask(`Here's a picture of a cat`)
  conv.ask(new Image({
    url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    alt: 'A cat',
  }))
})
	/*console.log('processWebhook');
	//console.log(JSON.stringify(request));
	var resp = JSON.parse(JSON.stringify(config.responseObj));	
	const agent = new WebhookClient({ request, response });
  
 
	function welcome(agent){
		console.log('hari');
		agent.add(new SimpleResponse({speech:"Hi I'm Hema !. I can help you to manage your leaves,search an employee, account recovery and create or track your service tickets. Please login to begin.",text:"Hi I'm Hema !. I can help you to manage your leaves,search an employee, account recovery and create or track your service tickets. Please login to begin."}));
		agent.add(new Card({
         title: `Menus`,
         imageUrl: '',
         text: ``,
         buttonText: 'Login',
         buttonUrl: 'https://logintests.herokuapp.com/login.html'
       })
     );
	}
	let intentMap = new Map();
	intentMap.set('Default Welcome Intent', welcome);
	intentMap.set('loginSuccess', loginSuccess);
	agent.handleRequest(intentMap);*/
}
router.post('/validateUser',function(req, res){
	var emps = config.employees;
	console.log(typeof(emps[req.body.username]));
	if(typeof(emps[req.body.username])!='undefined'){
		var smsApi = config.smsApi.replace('phonenumber',emps[req.body.username].ph);	
		smsApi = smsApi.replace('Otpnumber',45627);
		smsApi = smsApi.replace('name',emps[req.body.username].name);
		Otps[emps[req.body.username].ph] = 45627;
		console.log(smsApi,emps[req.body.username].ph);
		request(smsApi,function(error,response,body){
			console.log(error,body);
			res.status(200);
			res.json({token:'TKN'+emps[req.body.username].ph.split("").reverse().join("")}).end();
		});		
	}else{
		console.log('fail');
		res.status(400);
		res.json({status:false}).end();
	}		
});

router.post('/validateOtp',function(req, res){
	console.log(req.body);
	if(Otps[req.body.token]==req.body.otp){
		dialogFlowAPI("login success",currentSession);	
		res.status(200);
		res.json({status:true}).end();
	}else{
		res.status(400);
		res.json({status:false}).end();	
	}		
});
var simpleResponse = function(response, responseText){
	return new Promise(function(resolve,reject){
		response.payload.google.richResponse.items.push({
			"simpleResponse": {
				"textToSpeech": responseText,
				"displayText": responseText
			}
		});	
		resolve(response);
	})
			
}
var basicCard = function(response,text, buttons){
	return new Promise(function(resolve,reject){		
		response.payload.google.richResponse.items.push(
			{"basicCard": {
			  "formattedText": text,			 
			  "buttons": buttons,
			   "image": {},
			}		
		});		
	resolve(response);
	});
}
var dialogFlowAPI = function(qry, sessId){	
	return new Promise(function(resolve, reject){
		var options = { 
			method: 'POST',
			url: config.dialogFlowAPI,
			headers: {
				"Authorization": "Bearer " + config.accessToken
			},
			body:{
				sessionId: sessId,
				lang: "en",
				query:qry
			},			
			json: true 
		}; 					
		request(options, function (error, response, body) {
			if(error){
				res.json({error:"error in chat server api call"}).end();
			}else{						
				resolve(body);
			}		
		});			
	});
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





