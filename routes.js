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
		console.log(req.body.queryResult.parameters.empid);
		console.log(req.body.queryResult.parameters.phone);
		var data = {
			phone_number: '+91'+req.body.queryResult.parameters.phone
		};

		auth0.passwordless.sendSMS(data, function (err) {
		  if (err) {
			// Handle error.
		  }else{
			  
		  }
		});
})



var data = {
  username: '8500050085',
  password: '{VERIFICATION_CODE}'
};

auth0.passwordless.signIn(data, function (err) {
  if (err) {
    // Handle error.
  }
});


module.exports = router;



			