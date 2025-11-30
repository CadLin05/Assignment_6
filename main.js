import express from "express";
import scoreHandler from "./Routes/highscores_r.js";
import usersHandler from "./Routes/users.js";
const app = express();

app.use(express.json());
app.use("/highscores", scoreHandler);
app.use("/users", usersHandler)

app.listen(3000, () =>{
    console.log("listening on port 3000");

});