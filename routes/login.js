var express = require('express');
var MysqlHandler = require('../util/mysqlhandler.js');
var multipart = require('connect-multiparty');
var mult=multipart();
var publicData=require('../public/data.js');
var router = express.Router();
router.post('/',function(req,res,next){
	console.log("login")
    var data=new Date();
    var s1="select count(*) as count  from users where username=? ";
    MysqlHandler.exec({
        sql:s1,
        params:[
            req.body.username,
        ],
        callback:function(r) {
        	var data={
        		"msg":null,
        		"data":[],
        		"status":null,
        	}
            if(!!r)
            {
                if(r[0].count>0)
                {
                    var s2="select username,nickname,registerdate  from users where username=? and password=?"
                    MysqlHandler.exec({
                        sql:s2,
                        params:[
                            req.body.username,
                            req.body.password
                        ],
                        callback:function(r2) {
                            if(!!r2)
                            {
                                if(r2.length>0)
                                {
                                    var jwt = require('jsonwebtoken');
                                    var token = jwt.sign({ username: req.body.username }, 'shhhhh');
                                    var s3="update users set token=? where  username=?"
                                    MysqlHandler.exec({
                                        sql:s3,
                                        params:[
                                            token,
                                            req.body.username
                                        ],
                                        callback:function(r3) {
                                            if(!!r3)
                                            {
                                                r2[0].token=token;
                                                data.data=r2;
                                                data.msg="成功"
                                                data.status="SUCCESS";
                                                console.log(req.body.username);
                                                console.log(data.msg);
                                                res.json(data);
                                            }
                                            else
                                            {
                                                data.msg="请求失败"
                                                data.status="FAILURE";
                                                console.log(req.body.username);
                                                console.log(data.msg);
                                                res.json(data);
                                            }
                                        }
                                    })
                                }
                                else
                                {
                                    data.msg="密码错误"
                                    data.status="FAILURE";
                                    console.log(data.msg);
                                    res.json(data);
                                }
                            }
                            else
                            {
                                data.msg="请求错误"
                                data.status="FAILURE";
                                console.log(data.msg);
                                res.json(data);
                            }
                        }

                    })
                }
                else
                {
                    data.msg="用户不存在"
                    data.status="FAILURE"
                    res.json(data);
                }
            }
            else
            {
                data.msg="服务器异常"
                data.status="FAILURE"
                res.json(data);
            }
        }

    })
});
module.exports=router;