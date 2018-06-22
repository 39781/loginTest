var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	

var Otps ={};
router.post('/validateUser',function(req, res){
	var emps = config.employees;
	if(typeof(emps[req.body.username])!='undefined'){
		var smsApi = config.smsApi.replace('phonenumber',emps[req.body.username]);	
		smsApi = smsApi.replace('Otpnumber',45627);
		Otps[emps[req.body.username]] = 45627;
		console.log(smsApi,emps[req.body.username]);
		request(smsApi, function (error, response, body) {
			console.log(body);						 
			res.sendFile(path.join(__dirname, '../public', 'verifyOtp.html?token=TKN'+emps[req.body.username].split("").reverse().join("")));			
		});	
	}else{
		res.status(400);
		res.json({status:false}).end();
	}		
});

router.post('/validateOtp',function(req, res){
	if(Otps[req.body.phone]==req.body.otp){
		res.status(200);
		res.json({status:true}).end();	
	}else{
		res.status(400);
		res.json({status:false}).end();	
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





