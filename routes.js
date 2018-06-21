var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	
var AuthenticationClient = require('auth0').AuthenticationClient;

var auth0 = new AuthenticationClient({
  domain: '{YOUR_ACCOUNT}.auth0.com',
  clientId: '{OPTIONAL_CLIENT_ID}'
});

router.post('/botHandler',function(req, res){
	console.log(JSON.stringify(req.body));
})

var data = {
  phone_number: '{PHONE}'
};

auth0.passwordless.sendSMS(data, function (err) {
  if (err) {
    // Handle error.
  }
});



module.exports = router;



			