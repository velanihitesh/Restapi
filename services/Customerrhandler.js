
class Customerrhandler extends Error{
    constructor(status,meg){
        super()
        this.status = status
        this.message = meg
    }
    static userexists(message){
        return new Customerrhandler(420,message)
    }
    static usernotmatch(message="email & password not match...."){
        return new Customerrhandler(409,message)
    }
    static unauthrize(message="user unauthrize"){
        return new Customerrhandler(402,message)
    }
    
}
export default Customerrhandler