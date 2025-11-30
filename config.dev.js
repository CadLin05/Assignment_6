
export default {
    server: {
        host: "localhost",
        port: 3000
    },
    database: {
        host: "localhost",
        user: "root",
        password: "InfiniteHeart0",
        database: "game",
        connectionLimit: 10
    },
    passwords: {
        salt: 10
    },
    jwt:{
        secret: "doohickey",
    }
}