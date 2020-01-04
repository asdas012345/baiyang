class Test{
    constructor(n) {
        this.name=n
    }
    show(){
        console.log(this.name)
    }
}
let t=new Test("admin");
const {name,show}=t;
show()
show.call(t)