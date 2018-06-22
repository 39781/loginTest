var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	
var AuthenticationClient = require('auth0').AuthenticationClient;

var auth0 = new AuthenticationClient({
  domain: 'hexaesbot.auth0.com',
  clientId: 'tZ5fyaM3PEQhi7pwrQvfJP9VWRGrQ5Ke'
});

router.post('/botHandler',function(req, res){
	console.log(JSON.stringify(req.body));
		var response = JSON.parse(JSON.stringify(config.responseObj));
		console.log(req.body.queryResult.parameters.empid);		
		if(req.body.queryResult.action == 'input.welcome'){
			var data = {
				phone_number: '+917200050085'
			};
			auth0.passwordless.sendSMS(data, function (err, dat) {
			  if (err) {
				  console.log('err',err);
				  res.json(simpleResponse(response, JSON.stringify(err))).end();
				// Handle error.
			  }else{
				  console.log('res',dat);
				  res.json(simpleResponse(response, "Verification Code sent to your mobile number.\r\nPlease enter verification code")).end();
			  }
			});
		}
		if(req.body.queryResult.action == 'input.verifyOtp'){
			var data = {
			  username: '+917200050085',
			  password: req.body.queryResult.queryText
			};

			auth0.passwordless.signIn(data, function (err,dat) {
			  if (err) {
				// Handle error.
			  }else{
				  console.log(dat);
			  }
			});
		}
})





var simpleResponse = function(response, responseText){
	response.expectedInputs[0].inputPrompt.richInitialPrompt.items.push({
		"simpleResponse": {
			"textToSpeech": responseText,
			"displayText": responseText
		}
	});	
	console.log(JSON.stringify(response));
	return response;
}

module.exports = router;



			