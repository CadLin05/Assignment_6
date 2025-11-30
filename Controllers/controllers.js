
import {highscores} from "../Data/highscores.js";
import pool from './connections.js';
import { hashPassword } from "../Controllers/passwords.js";


//MYSQL

//FOR GET ROUTE WITH PAGINATION

export const getAllHighscoresWithPagintation = async (search, skip, limit) => {
    const searchTerm = `%${search || ""}%`;

    const safeSkip = parseInt(skip) || 0;
    const safeLimit = parseInt(limit) || 10;

    const query = `SELECT highscores.id AS highscoreId, users.username, highscores.score FROM highscores JOIN users ON highscores.userId = users.id WHERE users.username LIKE ? ORDER BY highscores.score ASC LIMIT ${safeLimit} OFFSET ${safeSkip}`;

    const [data] = await pool.execute(query, [searchTerm]);

    return data;
};

export const getTotalUserForSearch = async (search) => {
    const searchTerm = `%${search || ""}%`;

    const query = `SELECT COUNT(*) AS total FROM users WHERE username LIKE ?`;

    const data = await pool.execute(query, [searchTerm]);

    return data[0][0].total || 0;
};

//Finding One User
export const getOneUser = async(username) =>{
    if(!username){
        return null;
    }
    const data = await pool.execute(`SELECT highscores.id AS highscoreId, users.username, highscores.score FROM highscores JOIN users ON highscores.userId = users.id WHERE users.username LIKE ?`, [username]);
    return data[0][0] || null;
    //const data = await pool.execute(`SELECT * FROM users where username=?`,[username]);
    
}
    //const searchTerm = `%${search || ""}%`;

export const getUserByUsername = async (username) => {
    if (!username) return null;
    const [rows] = await pool.execute(`SELECT * FROM users WHERE username = ?`,[username]);
    return rows[0] || null;
};

export const updationByUsername = async(username, score) => {
    const data = await pool.execute(`INSERT INTO highscores(userId, score) VALUES((SELECT id FROM users WHERE username = ?), ?) ON DUPLICATE KEY UPDATE score = GREATEST(score, VALUES(score))`, [username, score]);
    if(data[0].affectedRows > 0){
        return true;
    }else{
        return false;
    }
};
/*
export const deleteByUsername = async(username) =>{
    const exists = await getUserByUsername(username);
    if(!exists) return null;
    //const [id] = await pool.execute(`SELECT id FROM users WHERE username = ?`, [username]);
    //const userId = id[0].id;
    userId = exists.id;
    const data = await pool.execute(`DELETE FROM highscores WHERE userId = ?`, [userId]); 
    if(data[0].affectedRows > 0){
        return true;
    }else{
        return false;
    }
};*/
export const deleteByUsername = async(username) =>{
    const exists = await getUserByUsername(username);
    
    console.log("USERNAME SENT TO GETUSERBYUSERNAME:", username);
    console.log("EXISTS RESULT:", exists);

    if(!exists) return null;

    const userId = exists.id;

    const [result] = await pool.execute(
        `DELETE FROM highscores WHERE userId = ?`, 
        [userId]
    );

    return result.affectedRows > 0;
};

//user registration
export const registerUser = async (username,password) => {
    const hashedPassword = await hashPassword(password);

    const data = await pool.execute(`INSERT INTO users(username,password,level) VALUES(?,?,?)`,[username,hashedPassword,"NORMAL"]);

    if(data[0].affectedRows > 0){
        return true;
    }else{
        return false;
    }
};
// login register helper


//scrapped functions
    
// creation/ updation
/** 
export const updation = async(username, score) => {
   
    const data = await pool.execute(`INSERT INTO highscores(userId, score) VALUES(?,?) ON DUPLICATE KEY UPDATE score = GREATEST(score, VALUES(score))`);
    if(data[0].affectedRows > 0){
        return true;
    }else{
        return false;
    }

};

export const createScore = async(username, score) =>{
    let newScore = null;
    const data = await pool.execute(`INSERT INTO highscores(userId, score) VALUES (?, ?)`,[userId,score]);
    if(data[0].affectedRows > 0){
        newScore = await getOneUser(data[0].insertId);
    }
}
export const updateScore = async(username, score) => {
    const exists = await getOneUser(username);
    if(exists){
       
    }
}*/
