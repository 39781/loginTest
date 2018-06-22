var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	


router.post('/validateUser',function(req, res){
	var emps = config.employees;
	if(typeof(emps[req.body.username])!='undefined'){
		var smsApi = config.smsApi.replace('phonenumber',emps[req.body.username]);	
		smsApi = smsApi.replace('Otpnumber',45627);
		request(smsApi, function (error, response, body) {
			console.log(body);
			res.sendFile(path.join(__dirname, '../public', 'verifyOtp.html?token=TKN'+emps[req.body.username].reverse()));			
		});	
	}			
});


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



			