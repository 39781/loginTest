var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	

var Otps ={};
router.get('/close',function(req,res){
	res.redirect('close.html');
})
router.post('/validateUser',function(req, res){
	var emps = config.employees;
	if(typeof(emps[req.body.username])!='undefined'){
		var smsApi = config.smsApi.replace('phonenumber',emps[req.body.username]);	
		smsApi = smsApi.replace('Otpnumber',45627);
		Otps[emps[req.body.username]] = 45627;
		console.log(smsApi,emps[req.body.username]);
		res.status(200);
			res.json({url:'verifyOtp.html?token=TKN'+emps[req.body.username].split("").reverse().join("")}).end();
	}	
});

router.post('/validateOtp',function(req, res){
	
	if(Otps[req.body.token]==req.body.otp){
		
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





