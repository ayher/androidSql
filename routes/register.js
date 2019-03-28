var express = require('express');
var MysqlHandler = require('../util/mysqlhandler.js');
var multipart = require('connect-multiparty');
var mult=multipart();
var router = express.Router();
router.post('/',function(req,res,next){
	console.log("register")
	console.log(req.body)
    var date=new Date();
    var data={
			"msg":null,
			"data":[],
			"status":null,
		}
    var s1="select count(*) as count  from users where username=? ";
    MysqlHandler.exec({
        sql:s1,
        params:[
            req.body.username,
        ],
        callback:function(r) {
            if(!!r)
			{
                if(r[0].count>0)
                {
                    data.msg="用户名已存在";
                    status="FAILURE";
                    console.log(data.msg);
                    res.json(data);
                }
                else
                {
                    var s2='insert into users values("",?,?,?,?)';
                    MysqlHandler.exec({
                        sql:s2,
                        params:[
                            req.body.username,
                            req.body.nickname,
                            req.body.password,
                            date
                        ],
                        callback:function(r2) {
                            if(!!r2)
                            {
                                data.msg="成功";
                                status="SUCCESS";
                                console.log(data.msg);
                                res.json(data);
                            }
                            else
                            {
                                data.msg="请求失败";
                                status="FAILURE";
                                console.log(data.msg);
                                res.json(data);
                            }
                        }})
                }
			}
			else {
                data.msg="服务器异常";
                status="FAILURE";
                console.log(data.msg);
                res.json(data);
			}
        }

    })
});
module.exports=router;