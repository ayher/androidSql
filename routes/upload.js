var express = require('express');
var MysqlHandler = require('../util/mysqlhandler.js');
var multipart = require('connect-multiparty');
var mult=multipart()
var router = express.Router();
router.post('/',function(req,res,next){
	console.log("upload");
	var data={
        		"msg":null,
        		"data":[],
        		"status":null,
        	}
	var filename=req.files.headimg.originalFilename;
	filename=filename.substring(0,filename.indexOf('.'));
    //判断文件名是否重复
	var s2 = 'select count(*) as count from files where filename=?';
		MysqlHandler.exec({
			sql:s2,
			params:[
	            filename,
	        ],
			callback:function(r2){
                if(!!r2)
				{
                    if(r2[0].count>0)
                    {
                        data.msg="文件名已存在";
                        data.status="FAILURE";
                        console.log(data.msg);
                        res.json(data)
                    }
                    else
                    {
                        var s0 = 'select courseid  from course where coursename=? and coursemajor=? and courseclass=?';
                        MysqlHandler.exec({
                            sql:s0,
                            params:[
                                req.body.course,
                                req.body.major,
                                req.body.class
                            ],
                            callback:function(r0){
                                var path=req.files.headimg.path;
                                path=path.replace('\\','\/');
                                path=path.substr(path.indexOf('/'));
                                if(r0.length>0)
                                {
                                    var s1 = 'insert into files(filename,fileurl,courseid) values(?,?,?)';
                                    MysqlHandler.exec({
                                        sql:s1,
                                        params:[
                                            filename,
                                            path,
                                            r0[0].courseid
                                        ],
                                        callback:function(r1){
                                            if(!!r1)
                                            {
                                                data.msg="成功";
                                                data.status="SUCCESS";
                                                console.log(data.msg);
                                                res.json(data)
                                            }
                                            else
                                            {
                                                data.msg="请求失败";
                                                data.status="FAILURE";
                                                console.log(data.msg);
                                                res.json(data)
                                            }
                                        }
                                    })
                                }
                                else
                                {
                                    var s1 = 'insert into course(coursename,coursemajor,courseclass) values(?,?,?)';
                                    MysqlHandler.exec({
                                        sql:s1,
                                        params:[
                                            req.body.course,
                                            req.body.major,
                                            req.body.class
                                        ],
                                        callback:function(r1){
                                            if(!!r1)
                                            {
                                                var s2 = 'insert into files(filename,fileurl,courseid) values(?,?,?)';
                                                MysqlHandler.exec({
                                                    sql:s2,
                                                    params:[
                                                        filename,
                                                        path,
                                                        r1.insertId
                                                    ],
                                                    callback:function(r2){
                                                        if(!!r2)
                                                        {
                                                            data.msg="成功";
                                                            data.status="SUCCESS";
                                                            console.log(data.msg);
                                                            res.json(data)
                                                        }
                                                        else
                                                        {
                                                            data.msg="请求失败";
                                                            data.status="FAILURE";
                                                            console.log(data.msg);
                                                            res.json(data)
                                                        }
                                                    }
                                                })
                                            }
                                            else
                                            {
                                                data.msg="数据库报错";
                                                data.status="FAILURE";
                                                console.log(data.msg);
                                                res.json(data)
                                            }
                                        }
                                    })
                                }

                            }
                        });
                    }
				}
				else{
                    data.msg="服务器异常";
                    data.status="FAILURE";
                    console.log(data.msg);
                    res.json(data)
				}
			}
		})
					
});

module.exports=router;