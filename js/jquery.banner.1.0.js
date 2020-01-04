;(function($){
    //交给别人使用的插件，必须严格要求自己
    "use strict";
    //传参让$,jQuery私有化
    $.fn.banner = function(options){ //fn是dom对象
        var that = this;
        // class Banner{
        //     constructor(o){
        //         o
        //     }
        // }
        // new Banner(options)

        // console.log(this);
        // this.btn = true;

        // 1.默认参数处理
        options = options || {};
        this._obj = {

            btn:options.btn===false ? false : true, //没传是undefined也是false
            list:options.list===false ? false : true,
            autoPlay:options.autoPlay===false ? false : true,
            delayTime:options.delayTime || 2000,
            moveTime:options.moveTime || 200,
            index:options.index || 0,
            iPrev:options.img.length-1,//可有可不有
            img:options.img || []
        };

        // 2.渲染布局:样式写到行内
        this._obj.init = function(){
            var str = ``;
            for(var i=0;i<this.img.length;i++){
                str += `<a href="##"><img src="${this.img[i]}"></a>`
            }
            that.html(`<div class="imgbox">${str}</div>`).css({
                width:1688,
                height:400,
                position:"relative",
                overflow:"hidden"
            }).children(".imgbox").css({
                width: 1688,
                height: 400,
            }).children("a").css({
                position: "absolute",
                left:1688,
                top:0,
                width: 1688,
                height: 400
            }).eq(0).css({
                left:0
            }).end().children("img").css({ //end()返回上一步才能找到children
                width: 1688,
                height: 400
            });
        }
        this._obj.init();
        this._obj.leftClick=function () {//this是left
            if (that._obj.index ==0){
                that._obj.index = that._obj.img.length-1;
                that._obj.iPrev=0;
            }else{
                that._obj.index--;
                that._obj.iPrev=that._obj.index+1;
            }
            that._obj.btnMove(1);
        }
        //点击右边的按钮
        this._obj.rightClick=function(){//this是right
            if (that._obj.index ==that._obj.img.length-1){
                that._obj.index = 0;
                that._obj.iPrev=that._obj.img.length-1;
            }else{
                that._obj.index++;
                that._obj.iPrev=that._obj.index-1;
            }
            that._obj.btnMove(-1);
        }
        //3.判断用户是否需要按钮功能
        if (this._obj.btn){
            //左右按钮的布局+样式
            $("<input type='button' id='left' value='<'>").css({
                left:0,
                marginLeft:250
            }).appendTo(this).//下一个兄弟就是右按钮
            after($("<input type='button' id='right' value='>'>").css({
                right:0,
                marginRight:250
            })).parent()
                .children("input").css({//集合操作input的定位
                    position:"absolute",
                    top:130,
                    width:40,
                    height:40,
                    border:"none",
                    background:"rgba(200,200,200,0.5)",
                    borderRadius:"50%",
                    color:"#ffffff"
                })
            //事件委托
            this.on("click","#left",that._obj.leftClick)
            this.on("click","#right",that._obj.rightClick)
            this._obj.btnMove=function (type) {
                // console.log(this.index,this.iPrev);
                let imgs=that.children(".imgbox").children("a");
                imgs.eq(this.iPrev).css({ //that是大框,找到a上一张的位置
                    left:0
                }).stop().animate({ //上一张向右走掉
                    left:imgs.eq(0).width()*type
                },this.moveTime).end().eq(this.index).css({ //有eq就有end为了返回上一步
                    left:-imgs.eq(0).width()*type
                }).stop().animate({
                    left:0
                },this.moveTime)
            if(!this.list) return;
                $(".list").children("li").css("background","rgba(200,200,200,0.6)")
                    .eq(this.index).css("background","red")//这里的当前是this.index
            }
        }
        //点击左边的按钮
        if (this._obj.list){
            let str="";//只在if中有效，用let快级作用域
            for (var i=0;i<this._obj.img.length;i++){
                str+=`<li>${i+1}</li>`;
            }
            $("<ul class='list'>").html(str).appendTo(this).css({//把li放进ul再放进那个外框div
                margin:0,
                padding:0,
                listStyle:"none",
                width:"100%",
                height:40,
                bottom:0,
                position:"absolute",
                display:"flex",
                justifyContent:"center",
                lineHeight:"40px",
                textAlign:"center"
            }).children("li").css({
                width:40,
                height:40,
                borderRadius: "50%",
                background:"rgba(200,200,200,0.6)",
                margin:"0 20px",
                textAlign: "center",
                cursor:"pointer"
            }).eq(0).css({
                background:"red"
            }).end().click(function () {//因为颜色是点击之后才变化
                if ($(this).index()>that._obj.index){ //当前点击的索引和上一个图片的索引的比较
                    that._obj.listMove($(this).index(),-1)
                }
                if ($(this).index()<that._obj.index){
                    that._obj.listMove($(this).index(),1)
                }
                that._obj.index = $(this).index();//索引设置成点击之后的索引

            })
            this._obj.listMove=function (iNow,type) {
                //赋值之前的移动，只是这次走的是this.index，进来的是iNow
                let imgs=that.children(".imgbox").children("a");
                imgs.eq(this.index).css({ //that是大框,找到a上一张的位置
                    left:0
                }).stop().animate({ //上一张向右走掉
                    left:imgs.eq(0).width()*type
                },this.moveTime).end().eq(iNow).css({ //有eq就有end为了返回上一步
                    left:-imgs.eq(0).width()*type
                }).stop().animate({
                    left:0
                },this.moveTime)
                //点击li的时候ul必存在，所以可以直接选
                $(".list").children("li").css("background","rgba(200,200,200,0.6)")
                    .eq(iNow).css("background","red")//这里的当前是iNOW
            }
        }
        if (this._obj.autoPlay){
            this._obj.t=setInterval(()=>{
                this._obj.rightClick();
            },this._obj.delayTime);
            this.hover(function () {
                clearInterval(that._obj.t)
            },function () {
                that._obj.t=setInterval(()=>{
                    that._obj.rightClick();
                },that._obj.delayTime);
            })
        }
    }
})($);