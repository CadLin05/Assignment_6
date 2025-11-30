import bcrypt from 'bcryptjs';
import config from "../config.dev.js";

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(config.passwords.salt);
    const hash = await bcrypt.hash(password,salt);

    return hash;
};

export const verifyPassword = async (hash,password) => {
    const verify = await bcrypt.compare(password, hash.toString('utf8'));

    return verify;
};

export const validatePassword = async (password, password2) => {
    if(password && password2){
        if(password === password2){
            return true;
        }else{  
            return false;
        }
    }else{
        return false;
    }
};