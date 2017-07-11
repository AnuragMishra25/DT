/* 
    DATAIKU - US CENSUS REPORT app.js
    Version: 1.0
    Author: Anurag Mishra
    Dated: Sun, 2 July 2017 12:20 AM
*/

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const http = require('http');
const request = require('request');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const nunjucks = require('nunjucks');
const dbPath = "./us-census.db";
var totalRows = 0;
const db = new sqlite3.Database(dbPath);
const port = 3000;

//configuring nunjucks
nunjucks.configure('./public/views/', {
    autoescape: true,
    express: app
});

app.use(express.static('public'));

//using bodyparser for various response parsing
app.use(body_parser.json());
app.use(body_parser.urlencoded({
  extended: true
}));

app.use(cookie_parser()); 
app.set('view engine', 'html');

 /**
 * Default route for the application, checks DB connections get hold of total rows in DB
 * @param {object} req - Node req object used for making server calls from Node server
 * @param {object} res - Node res object used for receiving result from Node server calls
 */
app.get('/', function (req, res) {
	db.all("SELECT count(*) AS count FROM census_learn_sql;",function(err,rows){
		if(err){
			console.log(err);
			res.send(400, {message: 'Error while Counting rows in table',  error: err});
		}else{
			global.totalRows = rows[0].count;
			res.render('index');
		}
	});
})


 /**
 * API to handle get request for columns
 * @param {object} req - Node req object used for making server calls from Node server
 * @param {object} res - Node res object used for receiving result from Node server calls
 */
app.get('/columns', function(req, res){
	let columns=[];
	db.all("SELECT name,sql FROM sqlite_master WHERE tbl_name = 'census_learn_sql' AND type = 'table'",function(err,rows){
		if(err){
			console.log(err);
			res.send(400, {message: 'Error while Fetching columns from table',  error: err});
		}else{
			let filteredResult = rows[0].sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(',');
			for(let item in filteredResult){
				let i=filteredResult[item].substring(filteredResult[item].indexOf('"')+1,filteredResult[item].lastIndexOf('"'));
				columns.push(i);
			}
			res.send(columns);
		}
	});
})


 /**
 * API to handle get request for data corresponding to columns
 * @param {object} req - Node req object used for making server calls from Node server
 * @param {object} res - Node res object used for receiving result from Node server calls
 */
app.get('/dataByColumn', function(req,res){
	let distinctValueCount=0;
	//Query to fecth count of all rows for distinct values
	db.all("SELECT COUNT (*) AS count FROM census_learn_sql GROUP BY `"+ req.query.id +"`;", function(err, rows){
		if(err){
			console.log(err);
			res.send(400, {message: 'Error while Counting rows from given column in table',  error: err});
		}else{
			distinctValueCount = rows.length;
			db.all("SELECT `" + req.query.id + "`, COUNT(*) AS count, AVG(age) AS avrg FROM census_learn_sql GROUP BY `"+ req.query.id +"` ORDER BY count DESC LIMIT 100;",function(err,rows){
				if(err){
					console.log(err);
					res.send(400, {message: 'Error while fetching 100 rows for given column in table',  error: err});
				}else{
					let setRows = 0;
					for(let item in rows){
						setRows +=rows[item].count;
					}
					let result = {};
					result.data = rows;
					result.count = distinctValueCount;
					result.clippedOutRows = global.totalRows - setRows;
					res.send(result);
				}
			});	
		}
	})
})

/**
 * API to handle get request for data corresponding to columns
 * @param {integer} port - Node requires port on which it will run
 * @param {function} callback funtion which runs as soon as the server starts
 */
app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})