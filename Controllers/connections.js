import mysql from 'mysql2/promise';
import config from "../config.dev.js";

//database connection
/*export const connection = await mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});*/

//Pooled Connections
export default mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    waitForConnections: true,
    connectionLimit: config.database.connectionLimit,
    queueLimit: 0
});