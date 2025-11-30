import { Router } from 'express';
import { deleteByUsername, getAllHighscoresWithPagintation, getOneUser, getUserByUsername, registerUser, updationByUsername } from '../Controllers/controllers.js';
import { authenticate, editor, admin } from '../middleware/authentication.js';
import { validatePassword, verifyPassword } from '../Controllers/passwords.js';
import { generatejwt } from '../Utils/jwt.js';
const router = Router();


//get all highscores and stuff with pagination
//this might not work so prepare to debug


//MYSQL GET ROUTE
router.get("/", async(req, res) =>{
    const search = req.query.search || "";
    const skip = parseInt(req.query.skip) || 5;
    const limit = parseInt(req.query.limit) || 2;

    const highscores = await getAllHighscoresWithPagintation(search,skip,limit);
    
    res.json({highscores});
    /*The GET route should return the following information for all existing highscores:
            { highscoreId, username, score }
 Anyone should be able to send a request to this GET route
  and recieve all the highscore data, no authentication required*/
});

//Get One User
router.get("/username",authenticate, editor, async(req,res)=>{
    const search = req.query.search || "";
    const user = await getOneUser(search);
    res.json({user});
});

//Creation and Updation

router.post("/insert", authenticate, editor, async(req,res)=>{
    const username = req.body.username || null;
    const score = Number(req.body.score) || null;

    if(username && score){
        const exist = await getUserByUsername(username);
        if(exist){
            const createOrupdate = await updationByUsername (username, score);
            if(createOrupdate){
                res.status(200).send(`Score for ${username} updated/created successfully.`);
            }else{
                res.status(500).send('Something went wrong when updating/creating a score');
            }
        }else{
            res.status(404).send('No user found');
        }
    }
});


//highscore deletion
router.delete("/delete/:username", authenticate, admin, async(req,res)=>{
    const username = req.params.username || null;
    const removed = await deleteByUsername(username);
    if(removed){
        res.json(removed);
    }else{
        res.status(400).send(`That person with username: ${username} was not found`);
    }
});


export default router;


