function ajaxGet(url, cb, data) {
    data = data || {};
    var str = "";
    for (var i in data) {
        str += `${i}=${data[i]}&`;
    }
    var d = new Date();
    url = url + "?" + str + "__lyt__=" + d.getTime();
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            cb(xhr.responseText);
        }
    }
    xhr.send();
}


function ajaxPost(url, cb, data) {
    data = data || {};
    var str = "";
    for (var i in data) {
        str += `${i}=${data[i]}&`;
    }
    str = str.slice(0, str.length - 1);
    var xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            cb(xhr.responseText);
        }
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(str);
}


function jsonp(url,cb,data){ 
    //利用script的src属性，引入原本跨域的资源地址
    //资源中返回字符,会被script标签作为解析
    //在资源中原本执行函数的字符,在前端定义函数
    //执行函数时，传参，定义函数时，接收
   var d=new Date();
   var str="";
   for(var i in data){
       str+=`${i}=${data[i]}&`
   }
   url=url+"?"+str+"_lujjt_="+d.getTime();
   var script=document.createElement("script");
   script.src=url;
   document.body.appendChild(script);
   //在前端定义函数,后台执行和传参
   //为了让fn和jsonp函数同级,把fn设置为全局函数。如果不设置为全局函数的话，后端发送执行函数和参数，没办法获取前端定义的函数。作用域问题，在jsonp里面。
   //可以放在jsonp外面？不能，因为这样就获取不到cb函数了。
   //data.callback先从前端发送到后端，再script标签解析src的时候再执行定义的这个函数
   //data.callback是变量
   window[data[data.columnName]]=function(res){ 
       cb(res);
   }
   //当前jsonp请求结束后，script标签存在的意义也结束了。
   script.remove();
}

