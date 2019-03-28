var express = require('express');
var MysqlHandler = require('../util/mysqlhandler.js');
var multipart = require('connect-multiparty');
var mult=multipart()
var router = express.Router();
router.get('/',function(req,res,next){
	console.log("test")
    res.redirect(301,'../upload/1.pdf')
});
module.exports=router;