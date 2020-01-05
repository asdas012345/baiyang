function setCookie(key,val,options){
    options = options || {};
    var time = "";
    if(options.expires){
        var d = new Date();
        d.setDate(d.getDate()+options.expires);
        time = ";expires="+d;
    }
    var path = options.path ? ";path=" + options.path : "";
    document.cookie = key + "=" + val + time + path;
}

function getCookie(key){
    var arr = document.cookie.split("; ");
    var v = "";
    arr.forEach((val)=>{
        if(val.split("=")[0] === key){
            v = val.split("=")[1];
        };
    })
    return v;
}

function removeCookie(key,options){
    options = options || {};
    options.expires = -1;
    setCookie(key,12321,options);
}