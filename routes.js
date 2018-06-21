var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	
var AuthenticationClient = require('auth0').AuthenticationClient;

var auth0 = new AuthenticationClient({
  domain: 'hexaesbot.auth0.com',
  clientId: 'tZ5fyaM3PEQhi7pwrQvfJP9VWRGrQ5Ke'
});

router.post('/botHandler',function(req, res){
	console.log(JSON.stringify(req.body));
	if(req.body.result.action === 'input.welcome'){
		var resObj = {};
		console.log(req.body.queryResult.parameters.empid);		
		var data = {
			phone_number: '+919626649195'
		};

		auth0.passwordless.sendSMS(data, function (err) {
		  if (err) {
			// Handle error.
		  }else{
				console.log(data);
				resObj= {
					"speech": "",
					"messages": [
						{
							"type": "simple_response",
							"platform": "google",
							"textToSpeech": "Please enter the OTP sent to your phone",
							"displayText": "Please enter the OTP sent to your phone"
						}
					]
				}
		  }
		});
		res.json(resObj);
	}
	else if(req.body.result.action === 'verify_otp'){
		console.log(req.body.queryResult.parameters.otp);		
		var data = {
			username: '+919626649195',
			password: req.body.queryResult.parameters.otp
		};

		auth0.passwordless.signIn(data, function (err) {
			if (err) {
				// Handle error.
			}
			else{
				console.log('After OTP');
				console.log(data);
			}
		});
	}
})


/*var data = {
  username: '+918500050085',
  password: '{VERIFICATION_CODE}'
};

auth0.passwordless.signIn(data, function (err) {
  if (err) {
    // Handle error.
  }
});*/



module.exports = router;



			
