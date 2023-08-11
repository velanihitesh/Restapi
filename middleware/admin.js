import User from '../model/index.js'
import Customerrhandler from '../services/Customerrhandler.js'

const admin = async(req,res,next)=>{
    try{
        const result = await User.findOne({_id:req.user._id})
      
    if(result.role === "manager"){
         next()
    }else{
        return next(Customerrhandler.unauthrize())
    }
    }
    catch(error){
        return next(Customerrhandler.unauthrize())
    }

}
export default admin