var express = require('express');
var MysqlHandler = require('../util/mysqlhandler.js');
var multipart = require('connect-multiparty');
var mult=multipart()
var router = express.Router();
router.get('/',function(req,res,next){
	console.log("getcollect")
    var data={
    		"msg":null,
    		"data":[],
    		"status":null,
    	}
	var s0='select username from users where token="'+req.headers.authorization+'"';
    MysqlHandler.exec({
        sql:s0,
        callback:function(r0) {
            if(!!r0)
			{
                if(r0.length>0)
                {
                    var s1='select fileid,filename,fileurl from files where fileid in (select fileid from collect where username=?)'
                    MysqlHandler.exec({
                        sql:s1,
                        params:[
                            r0[0].username,
                        ],
                        callback:function(r1) {
                            if(!!r1)
                            {
                                data.msg="成功"
                                data.status="SUCCESS";
                                data.data=r1;
                                console.log(data.msg);
                                res.json(data);
                            }
                            else
                            {
                                data.msg="请求失败"
                                data.status="FAILURE";
                                console.log(data.msg);
                                res.json(data);
                            }
                        }
                    })
                }
                else
                {
                    data.msg="登录超时"
                    data.status="FAILURE";
                    data.data=r0;
                    console.log(data.msg);
                    res.json(data);
                }
			}
            else
            {
                data.msg="服务器异常"
                data.status="FAILURE";
                data.data=r0;
                console.log(data.msg);
                res.json(data);
            }
    	}
    })
});
module.exports=router;