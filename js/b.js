const obj={
    a:10,b:20,c:30,
    init:function(){
        const str =`这里有数字${this.a},${this.b},${this.c}`
        console.log(str)
    }
}
obj.init();