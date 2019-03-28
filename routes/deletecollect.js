var express = require('express');
var MysqlHandler = require('../util/mysqlhandler.js');
var multipart = require('connect-multiparty');
var mult=multipart()
var router = express.Router();
router.get('/',function(req,res,next){
	console.log("deletecollect");
    var date=new Date();
    var data={
    		"msg":null,
    		"data":[],
    		"status":null,
    	}
	var s0='select username  from users where token="'+req.headers.authorization+'"';
    MysqlHandler.exec({
        sql:s0,
        callback:function(r0) {
            if(!!r0)
			{
                if(r0.length>0)
                {
                    var s1='select count(*) as count from collect where username=? and fileid=?'
                    MysqlHandler.exec({
                        sql:s1,
                        params:[
                            r0[0].username,
                            req.query.fileid,
                        ],
                        callback:function(r1) {
                            if(!!r1)
                            {
                                if(r1[0].count>0)
                                {
                                    var s2='delete from collect where username=? and fileid=?'
                                    MysqlHandler.exec({
                                        sql:s2,
                                        params:[
                                            r0[0].username,
                                            req.query.fileid,
                                        ],
                                        callback:function(r2) {
                                            if(!!r2)
                                            {
                                                data.msg="成功";
                                                data.status="SUCCESS";
                                                console.log(data.msg);
                                                res.json(data);
                                            }
                                            else
                                            {
                                                data.msg="请求失败";
                                                data.status="FAILURE";
                                                console.log(data.msg);
                                                res.json(data);
                                            }
                                        }
                                    })
                                }
                                else {
                                    data.msg="收藏不存在";
                                    data.status="FAILURE";
                                    console.log(data.msg);
                                    res.json(data);
                                }
                            }

                        }
                    })

                }
                else
                {
                    data.msg="登录超时";
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


    }})
});
module.exports=router;