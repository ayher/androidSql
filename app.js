var express=require('express');
var test=require('./routes/test.js');
var login=require('./routes/login.js');
var getpdf=require('./routes/getpdf.js');
var register=require('./routes/register.js');
var addcollect=require('./routes/addcollect.js');
var getcollect=require('./routes/getcollect.js');
var deletecollect=require('./routes/deletecollect.js');
var changepassword=require('./routes/changepassword.js');
var getrecentlylook=require('./routes/getrecentlylook.js');
var setrecentlylook=require('./routes/setrecentlylook.js');
var getcourseclass=require('./routes/getcourseclass');
var upload=require('./routes/upload.js');
var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');


var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.all('*', function(req, res, next) {             //跨域
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/pdf;charset=utf-8");
    next();
});
app.use(multipart({uploadDir:'./upload'}));
app.use('/app/test',test);
app.use('/app/login',login);
app.use('/app/getpdf',getpdf);
app.use('/app/register',register);
app.use('/app/getcourseclass',getcourseclass);
app.use('/app/addcollect',addcollect);
app.use('/app/getcollect',getcollect);
app.use('/app/deletecollect',deletecollect);
app.use('/app/changepassword',changepassword);
app.use('/app/getrecentlylook',getrecentlylook);
app.use('/app/setrecentlylook',setrecentlylook);
app.use('/app/upload',upload);
app.use('/',express.static( __dirname+'/upload'));
var server=app.listen(3000,function(){
	console.log("start")
});
module.exports=app;