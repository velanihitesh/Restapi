import jwt from 'jsonwebtoken'
import { ACC_KEY } from '../config/index.js'

class JWTservices {
    static sign(payload,expiry='60s',secret=ACC_KEY){
        return jwt.sign(payload,secret,{expiresIn:expiry})
    }
    static verify(token,secret=ACC_KEY){
        return jwt.verify(token,secret)
    }
}
export default JWTservices
