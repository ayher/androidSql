var express = require('express');
var MysqlHandler = require('../util/mysqlhandler.js');
var multipart = require('connect-multiparty');
var mult=multipart();
var publicData=require('../public/data.js');
var router = express.Router();
router.post('/',function(req,res,next){
	console.log("changepassword");
	var data={
    		"msg":null,
    		"data":[],
    		"status":null,
    	}
    var s0='select username,password  from users where token="'+req.headers.authorization+'"';
    MysqlHandler.exec({
        sql:s0,
        callback:function(r0) {
            if(!!r0)
			{
                if(r0.length>0)
                {
                    if(r0[0].password==req.body.orginalpassword)
                    {
                        var s1='update users set password=? where username=?'
                        MysqlHandler.exec({
                            sql:s1,
                            params:[
                                req.body.newpassword,
                                r0[0].username
                            ],
                            callback:function(r1) {
                                if(!!r1)
                                {
                                    data.msg="成功";
                                    data.status="SUCCESS";
                                    console.log(data.msg);
                                    res.json(data);
                                }
                                else
                                {
                                    data.msg="请求失败";
                                    data.status="SUCCESS";
                                    console.log(data.msg);
                                    res.json(data);
                                }
                            }
                        })

                    }
                    else
                    {
                        data.msg="原密码错误";
                        data.status="FAILURE";
                        console.log(data.msg);
                        res.json(data);
                    }
                }
                else
                {
                    data.msg="用户不存在";
                    data.status="FAILURE";
                    console.log(data.msg);
                    res.json(data);
                }
			}
            else
            {
                data.msg="服务器异常";
                data.status="FAILURE";
                console.log(data.msg);
                res.json(data);
            }

        }

    })
});
module.exports=router;