const http=require("http");//服务器
const fs=require("fs");//文件响应系统
const url=require("url");//解析get方法发过来的url
const querystring=require("querystring");//解析post方法的数据
//开启服务器
http.createServer((req,res)=>{
    if(req.url!="/favicon.ico"){
       var pathname= url.parse(req.url).pathname; //？之前的字段
       if(pathname==="/api"){
           ajaxHandle(req,res); //有/api说明处理get和post的ajax
       }else{
           fsHandle(req,res)
       }
    }
}).listen("83");

//node程序就像一个大的闭包，只要服务器不停，就一直能拿到所有的变量,
//前端我们想要拿到之前的变量，就要用到闭包，变量在内存中没有被释放。
let userMsg=[]

function ajaxHandle(req,res){
let str="";
req.on("data",(d)=>{ //这个d是那个数据，但是并不全,只有一段
    str+=d;
})//在req上绑定一个on事件

req.on("end",()=>{//结束的时候可以拿到那个str完整的数据
    let data=str?//有str走post，没有走get，data是对象
    querystring.parse(str)://解析自身就是数据，将字符转换成对象
    url.parse(req.url,true).query;//解析req.url请求的所有数据
    if(data.type=="login"){
        //登陆
        login(res,data);
    }else{
        //注册
        register(res,data);
    }
})
}
function login(res,data){
    //登陆
    let on=true;
    for(var i=0;i<userMsg.length;i++){//如果第一个就不存在，就不走后面的了
        if(userMsg[i].user===data.user){//外面有for循环不能else
            on=false;
            let resMsg={};
            if(userMsg[i].pass===data.pass){
                resMsg.code=1;
                resMsg.msg="登录成功"          
            }else{
                resMsg.code=2;
                resMsg.msg="密码错误" 
            }
            res.write(JSON.stringify(resMsg));
            res.end();
            return;
            }
        }
        //如果用户不存在
        if(on){
            let resMsg={
                code:0,
                msg:"用户名不存在,请先注册"
            }
            res.write(JSON.stringify(resMsg));
            res.end();
        }

    }


   

function register(res,data){
    //注册
    let i=userMsg.some((val)=>{//val是遍历出来的
        return val.user===data.user;
    })//只要有一个重复就返回true  
    let resMsg={}
    if(i){
        resMsg.code=0;
        resMsg.msg="用户名重复";
    }else{
        userMsg.push({
            user:data.user,
            pass:data.pass,
            onoff:0
        })
        resMsg.code=1;
        resMsg.msg="注册成功";
        
    }
    res.write(JSON.stringify(resMsg))//把对象转成json
    res.end();//结束请求
}
function fsHandle(req,res){
    const path="."+url.parse(req.url).pathname
  console.log(path)
    fs.readFile(path,(err,data)=>{//读取文件
        if(err){
            // fs.readFile(".src/err/404.html",(err.data)=>{}) //如果没请求到请求404文件
            res.write("404");
        }else{
            res.write(data)
        }
        res.end();
    })
}
