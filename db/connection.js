//establish connections with database

//import mysql
const mysql = require("mysql2")

//create connection with our database

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_tracker' //whatever we name our database
})

module.exports = db;