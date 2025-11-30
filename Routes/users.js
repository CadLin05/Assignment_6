import { authenticate, editor, admin } from '../middleware/authentication.js';
import { Router } from 'express';
import { validatePassword, verifyPassword } from '../Controllers/passwords.js';
import { registerUser, getOneUser, getUserByUsername } from '../Controllers/controllers.js';
import { generatejwt } from '../Utils/jwt.js';
const router = Router();

//register
router.post("/register", async (req,res) => {
    const username = req.body.username || null;
    const password = req.body.password || null;
    const password2 = req.body.password2 || null;

    if(username && password && password2){
        const exist = await getUserByUsername(username);
        if(!exist){
            if(validatePassword(password,password2)){
                const created = await registerUser(username,password);
                if(created){
                    res.send(`The user, ${username} was created successfully`);
                }else{
                    res.status(500).send(`Something went wrong while creating a user account`);
                }
            }else{
                res.status(400).send(`Your provided password does not match the complexity requirements`);
            }
        }else{
            res.status(400).send(`An account with that username already exists`);
        }
    }else{
        res.status(400).send(`PLease provide all the required data for registering`);
    }
});

//login route
router.post("/login", async(req,res)=>{
    const username = req.body.username || null;
    const password = req.body.password || null;
  

    if(username && password ){
        const exist = await getUserByUsername(username);
        if(exist){
            //verify password
             const matches = await verifyPassword(exist.password, password); // just "password since passed in above"
            if(matches){
                //Need to generate JWT 
                const token = await generatejwt({username: exist.username, level: exist.level});
                res.json({success: true, token, user: {username:exist}})
            }else{
                res.status(400).send("Username/password provided does not match any records.")
            }
        }else{
            res.status(400).send("Username/password provided does not match any records.s")
        }
    }else{
        res.status(400).send(`Please provide all the required data`)
    }
});
export default router;
