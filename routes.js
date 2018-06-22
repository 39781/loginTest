var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	
var AuthenticationClient = require('auth0').AuthenticationClient;

router.post('/validateUser',function(req, res){
	res.json({status:true}).end();
});

module.exports = router;



			