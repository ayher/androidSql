var express = require('express');
var MysqlHandler = require('../util/mysqlhandler.js');
var multipart = require('connect-multiparty');
var mult=multipart()
var router = express.Router();
router.get('/',function(req,res,next){
	console.log("getpdf")
	var data={
    		"msg":null,
    		"data":[],
    		"status":null,
    	}
	 var s0='select username  from users where token="'+req.headers.authorization+'"';
    //var s0='select username  from users where token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjUxMjAxNjA0NDgiLCJpYXQiOjE1NTIyMTU4ODh9.HAoJHppjBJ8mAB3o-qFpfq3qDYuuKc_ypC4GZ8hDCQ4"';
    MysqlHandler.exec({
        sql:s0,
        callback:function(r0) {
            if(!!r0)
			{
                if(r0.length>=0)
                {
                    //var s1='select files.fileid,filename,fileurl,if(username=?,1,0) as ifcollect from files left join collect on files.fileid= collect.fileid	where files.courseid in (select courseid from course where coursename=? and courseclass=? and coursemajor=?)'
                    var s1='select files.fileid,filename,fileurl,if(username=?,1,0) as ifcollect from files left join collect on files.fileid= collect.fileid	where files.courseid in (select courseid from course where coursename=? and courseclass=? )'
                    MysqlHandler.exec({
                        sql:s1,
                        params:[
                            r0[0].username,
                            req.query.course,
                            req.query.grade,
                        ],
                        callback:function(r1) {
                            if(!!r1)
                            {
                                var arr=r1;
                                for(var i=0;i<arr.length-1;i++)
                                {
                                    for(var j=i+1;j<arr.length;j++){
                                        if(arr[j].fileid===arr[i].fileid)
                                        {
                                            if(arr[j].ifcollect===1)
                                            {
                                                arr.splice(i,1);
                                                i= -1;
                                                break;
                                            }
                                            else
                                            {
                                                arr.splice(j,1);
                                                j--;
                                            }
                                        }
                                    }
                                }
                                data.msg="成功"
                                data.status="SUCCESS"
                                data.data=arr;
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
                    res.json(data);
                }
			}
            else
            {
                data.msg="服务器异常"
                data.status="FAILURE";
                data.data=r0;
                res.json(data);
            }
        	
        }

    })




    
});
module.exports=router;