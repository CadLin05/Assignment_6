import jwt from "jsonwebtoken";
import config from "../config.dev.js"
export const generatejwt = (payload)=>{
    //payload is username or level of account
    return new Promise((resolve, reject)=>{
        const token = jwt.sign(payload, config.jwt.secret);
        resolve(token);
    });
};
export const verifyJWT = (token) =>{
    return new Promise((resolve,reject)=>{
        try{
            const data = jwt.verify(token, config.jwt.secret);
            resolve(data);
        }catch(error){
            resolve(null);
        }
        
    });
}