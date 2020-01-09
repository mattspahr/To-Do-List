const mysql = require('mysql');

/*
 *  MySQL DB Connection
 */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'matt',
    password: 'Albanylax21!',
    database: 'ToDoList'
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

module.exports = connection;