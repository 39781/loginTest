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
	
	console.log('processWebhook');
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
	agent.handleRequest(intentMap);
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
	return new Promise(function(resolve, reject){.
	console.log('hari dialogflowAPI');
		var options = { 
			method: 'POST',
			url: "https://us-central1-esbot-332bc.cloudfunctions.net/dialogflowFirebaseFulfillment",
			headers: {"host":"us-central1-esbot-332bc.cloudfunctions.net","user-agent":"Apache-HttpClient/4.5.4 (Java/1.8.0_171)","transfer-encoding":"chunked","accept":"text/plain, */*","accept-charset":"big5, big5-hkscs, cesu-8, euc-jp, euc-kr, gb18030, gb2312, gbk, ibm-thai, ibm00858, ibm01140, ibm01141, ibm01142, ibm01143, ibm01144, ibm01145, ibm01146, ibm01147, ibm01148, ibm01149, ibm037, ibm1026, ibm1047, ibm273, ibm277, ibm278, ibm280, ibm284, ibm285, ibm290, ibm297, ibm420, ibm424, ibm437, ibm500, ibm775, ibm850, ibm852, ibm855, ibm857, ibm860, ibm861, ibm862, ibm863, ibm864, ibm865, ibm866, ibm868, ibm869, ibm870, ibm871, ibm918, iso-2022-cn, iso-2022-jp, iso-2022-jp-2, iso-2022-kr, iso-8859-1, iso-8859-13, iso-8859-15, iso-8859-2, iso-8859-3, iso-8859-4, iso-8859-5, iso-8859-6, iso-8859-7, iso-8859-8, iso-8859-9, jis_x0201, jis_x0212-1990, koi8-r, koi8-u, shift_jis, tis-620, us-ascii, utf-16, utf-16be, utf-16le, utf-32, utf-32be, utf-32le, utf-8, windows-1250, windows-1251, windows-1252, windows-1253, windows-1254, windows-1255, windows-1256, windows-1257, windows-1258, windows-31j, x-big5-hkscs-2001, x-big5-solaris, x-compound_text, x-euc-jp-linux, x-euc-tw, x-eucjp-open, x-ibm1006, x-ibm1025, x-ibm1046, x-ibm1097, x-ibm1098, x-ibm1112, x-ibm1122, x-ibm1123, x-ibm1124, x-ibm1166, x-ibm1364, x-ibm1381, x-ibm1383, x-ibm300, x-ibm33722, x-ibm737, x-ibm833, x-ibm834, x-ibm856, x-ibm874, x-ibm875, x-ibm921, x-ibm922, x-ibm930, x-ibm933, x-ibm935, x-ibm937, x-ibm939, x-ibm942, x-ibm942c, x-ibm943, x-ibm943c, x-ibm948, x-ibm949, x-ibm949c, x-ibm950, x-ibm964, x-ibm970, x-iscii91, x-iso-2022-cn-cns, x-iso-2022-cn-gb, x-iso-8859-11, x-jis0208, x-jisautodetect, x-johab, x-macarabic, x-maccentraleurope, x-maccroatian, x-maccyrillic, x-macdingbat, x-macgreek, x-machebrew, x-maciceland, x-macroman, x-macromania, x-macsymbol, x-macthai, x-macturkish, x-macukraine, x-ms932_0213, x-ms950-hkscs, x-ms950-hkscs-xp, x-mswin-936, x-pck, x-sjis_0213, x-utf-16le-bom, x-utf-32be-bom, x-utf-32le-bom, x-windows-50220, x-windows-50221, x-windows-874, x-windows-949, x-windows-950, x-windows-iso2022jp","content-type":"application/json; charset=UTF-8","function-execution-id":"s1eobyyfu66k","x-appengine-api-ticket":"ce099efe498f0c6f","x-appengine-city":"?","x-appengine-citylatlong":"0.000000,0.000000","x-appengine-country":"US","x-appengine-https":"on","x-appengine-region":"?","x-appengine-user-ip":"35.232.198.88","x-cloud-trace-context":"3709bb41009f7c7c2ef9aabbf705f171/12278743691630185874;o=1","x-forwarded-for":"35.232.198.88, 35.232.198.88","x-forwarded-proto":"https","accept-encoding":"gzip"},
			body:{"responseId":"5ef580e1-e61c-40fe-a09a-704ccf4930f7","queryResult":{"queryText":"GOOGLE_ASSISTANT_WELCOME","action":"input.welcome","parameters":{},"allRequiredParamsPresent":true,"fulfillmentMessages":[{"platform":"ACTIONS_ON_GOOGLE","simpleResponses":{"simpleResponses":[{"textToSpeech":"Hi I'm Hema !. I can help you to manage your leaves,search an employee, account recovery and create or track your service tickets. Please login to begin."}]}},{"platform":"ACTIONS_ON_GOOGLE","basicCard":{"formattedText":"Please login to help you.","image":{},"buttons":[{"title":"Login","openUriAction":{"uri":"https://logintests.herokuapp.com/login.html"}}]}},{"text":{"text":[""]}}],"outputContexts":[{"name":"projects/esbot-332bc/agent/sessions/1529900391662/contexts/google_assistant_welcome"},{"name":"projects/esbot-332bc/agent/sessions/1529900391662/contexts/actions_capability_screen_output"},{"name":"projects/esbot-332bc/agent/sessions/1529900391662/contexts/actions_capability_audio_output"},{"name":"projects/esbot-332bc/agent/sessions/1529900391662/contexts/google_assistant_input_type_voice"},{"name":"projects/esbot-332bc/agent/sessions/1529900391662/contexts/actions_capability_media_response_audio"},{"name":"projects/esbot-332bc/agent/sessions/1529900391662/contexts/actions_capability_web_browser"}],"intent":{"name":"projects/esbot-332bc/agent/intents/6ce4514e-def5-4eb6-9a99-15f74d58e810","displayName":"Default Welcome Intent"},"intentDetectionConfidence":1,"diagnosticInfo":{},"languageCode":"en-us"},"originalDetectIntentRequest":{"source":"google","version":"2","payload":{"isInSandbox":true,"surface":{"capabilities":[{"name":"actions.capability.AUDIO_OUTPUT"},{"name":"actions.capability.SCREEN_OUTPUT"},{"name":"actions.capability.MEDIA_RESPONSE_AUDIO"},{"name":"actions.capability.WEB_BROWSER"}]},"inputs":[{"rawInputs":[{"query":"talk to ES bat","inputType":"VOICE"}],"intent":"actions.intent.MAIN"}],"user":{"lastSeen":"2018-06-25T04:14:53Z","locale":"en-US","userId":"ABwppHHUz6ouuMtf5SSaIFaSffwkOVPPO4_FV_146Yz5wyGfCE03jubmYfdUMbXThrZpjvHDClxvd0U"},"conversation":{"conversationId":"1529900391662","type":"NEW"},"availableSurfaces":[{"capabilities":[{"name":"actions.capability.AUDIO_OUTPUT"},{"name":"actions.capability.SCREEN_OUTPUT"},{"name":"actions.capability.WEB_BROWSER"}]}]}},"session":"projects/esbot-332bc/agent/sessions/1529900391662"},			
			json: true 
		}; 					
		request(options, function (error, response, body) {
			if(error){
				res.json({error:"error in chat server api call"}).end();
			}else{		
				console.log(body);
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





