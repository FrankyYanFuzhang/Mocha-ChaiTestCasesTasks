'use strict';
const mysql = require('mysql');
//local mysql db connection
const dbConn = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: 'YourPass',
	database: 'hkscp_db'
});
dbConn.connect(function (err) {
	if (err) throw err;
	console.log("Database Connected!");
});
module.exports = dbConn;