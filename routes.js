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
router.post('/botHandler',function(req, res){
	var resp = JSON.stringify(config.responseObj);
	simpleResponse(resp,"Hi I'm Hema !. I can help you to manage your leaves,search an employee, account recovery and create or track your service tickets. Please login to begin.").then(function(result){
		var buttons= [
            {
              "title": "Login",
              "openUriAction": {
                "uri": "https://logintests.herokuapp.com/login.html"
              }
            }
          ]
		return basicCard(resp,"Please login to help you.",buttons)
	})
	.then(function(result){
		res.json(result).end();
	});
	
	
})
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
		res.status(200);
		res.json({status:true,qry:"loginSuccess",accessToken:config.accessToken}).end();
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
		response.payload.google.richResponse.items(
			{"basicCard": {
			  "formattedText": text,
			  "image": {},
			  "buttons": buttons
			}		
		});
	resolve(response);
	});
}


module.exports = router;





