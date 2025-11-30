import { verifyJWT } from "../Utils/jwt.js"

//need to be logged in
export const authenticate = async(req, res, next) => { //next is function call that passes onto next middleware or to function if no more middleware
    //grab token
    const authHeader = req.headers.authorization;
    if (authHeader){
        const token = authHeader.split(' ')[1];
        if(token && token.length > 0){
            const payload = await verifyJWT(token);
            if(payload){
                req.user = payload;
                next();//pass request to next middleware in line or route itself trying to be accessed
            }else{
                res.status(401).send('Invalid or expired token.');
            }
        }else{
            res.status(401).send('Unauthorized access attempt');
        }
    }else{
        res.status(401).send('Unauthorized access attempt');
    };
    //jwt have set header option in every request header
    // not always just if you need it for authentication
};

//admin 

export const admin = (req,res,next)=>{
    const user = req.user;
    if(user){
        if(user.level === "ADMIN"){
            next();
        };
    }else{
        res.status(401).send('Unauthorized access attempt');
    };
};
// editor
export const editor = (req,res,next)=>{
    const user = req.user;
    if(user){
        if(user.level === "EDITOR" || user.level === "ADMIN"){ //user.level === "Editor" || user.level === admin, works for anything with admin permissions too
            next();
        };
    }else{
        res.status(401).send('Unauthorized access attempt');
    };
};