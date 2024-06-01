//establish connections with database

//import mysql
const mysql = require("mysql2")
require('dotenv').config();

//create connection with our database

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME //whatever we name our database
})

module.exports = db;