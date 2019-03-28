var express = require('express');
var MysqlHandler = require('../util/mysqlhandler.js');
var multipart = require('connect-multiparty');
var mult=multipart()
var router = express.Router();
router.get('/',function(req,res,next){
    console.log("getcourseclass")
    var data={
        "msg":null,
        "data":[],
        "status":null,
    }
    var s0='select courseclass,coursemajor,coursename from course GROUP BY courseclass,coursemajor,coursename;';
    MysqlHandler.exec({
        sql: s0,
        callback: function (r0) {
            if(!!r0)
            {
                data.msg="成功"
                data.status="SUCCESS";
                var datatest={"大一上":{},"大一下":{},"大二上":{},"大二下":{},"大三上":{},"大三下":{},};
                for (var i=0;i<r0.length;i++)
                {
                    for(var key in datatest){
                        if(key===r0[i].courseclass)
                        {
                            if(!datatest[key].hasOwnProperty(r0[i].coursemajor))
                            {
                                datatest[key][r0[i].coursemajor]=[];
                            }
                            var j;
                            for(j=0;j<datatest[key][r0[i].coursemajor].length;j++)
                            {
                                if(datatest[key][r0[i].coursemajor][j]===r0[i].name)
                                {
                                    break;
                                }
                            }
                            if(j===datatest[key][r0[i].coursemajor].length)
                                datatest[key][r0[i].coursemajor].push(r0[i].coursename);
                        }
                    }
                }
                data.data=datatest;
                console.log(data.msg);
                res.send(data);
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