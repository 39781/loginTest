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
		console.log('empid',req.body.queryResult.parameters.empid);		
		console.log('query text',req.body.queryResult.queryText);
		console.log('action',req.body.queryResult.action);
		switch(req.body.queryResult.action){
			case 'input.welcome':func = welcome;break;
			case 'input.verifyOtp':func = verifyOtp;break;
		}
		func(req.body)
		.then(function(reply){
			res.json(reply).end();
		})
		.catch(function(err){
			res.json(err).end();
		})
})


var welcome = function(request){
	return new Promise(function(resolve, reject){
		var response = JSON.parse(JSON.stringify(config.responseObj));
		var data = {
			phone_number: '+917200050085'
		};
		auth0.passwordless.sendSMS(data, function (err, dat) {
		  if (err) {
			  console.log('err',err);
			  reject(simpleResponse(response, JSON.stringify(err)));
			// Handle error.
		  }else{
			  console.log('res',dat);
			  resolve(simpleResponse(response, "Verification Code sent to your mobile number.\r\nPlease enter verification code"));
		  }
		});
	});
}

var verifyOtp = function(request){
	var response = JSON.parse(JSON.stringify(config.responseObj));
	return new Promise(function(resolve, reject){
		console.log('token vertifying');
		var data = {
		  username:'+7200050085',
		  password: request.queryResult.queryText
		};

		auth0.passwordless.verifySMSCode(data, function (err,dat) {
		  if (err) {
			  console.log('error',err);
			// Handle error.
		  }else{
			  console.log(dat);
		  }
		});
	});
}

var simpleResponse = function(response, responseText){
	response.payload.google.richResponse.items.push({
		"simpleResponse": {
			"textToSpeech": responseText,
			"displayText": responseText
		}
	});		
	return response;
}

module.exports = router;



			