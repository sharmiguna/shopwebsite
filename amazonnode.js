var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path');


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'sharmi',
  password: 'gunathi24',
  database: 'amazon'
});

connection.connect(function(err) {
  if (err) {
  	throw err
  } else {
  console.log('You are now connected to the server / database...');
  }
});

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})
); 

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

var router = express.Router();

router.get('/home', function(req, res) {
	console.log("in usershome page");
	res.sendfile('public/projectamazon.html');
});

router.route('/home/list')
	.get(function(req, res) {
		console.log("in shopping page - get ");
		var query = "SELECT * from my_view ";
		console.log("check web page for shopping page", query);
		if(req.query.inp) {
			var id = parseInt(req.query.inp);
			console.log("entered the page to get the values of the product with id", id);
			query += "where ID ="+req.query.inp +";" ;  
			connection.query(query, function(err, rows, fields) {
			    if (err)  {
			    	console.log(err);
			    	res.send("error");
				} else {
					console.log("success to redirect to product details");
					res.render('productdetails', {ID : id});
				}
			});	
		} else {
			query += ";";
			console.log("the query is", query);
			connection.query(query, function(err, rows, fields) {
			    if (err)  {
			    	console.log(err);
				} else {
					console.log(rows);
					res.send(rows);
				}
			});	
		}
	});

router.route('/home/details')
	.get(function(req,res){
		console.log("in details get");
		var id = req.query.inp;
		var query1 = "select * from my_view where ID = " + id;	
		console.log(query1);	
		connection.query(query1, function(err, rows, fields) {
		    if (err)  {
		    	console.log(err);
			} else {
				console.log("successfully sending details to product pagee", rows);
				res.send(rows);
			}
		});
	})

router.route('/home/reviewsredirect')
	.get(function(req,res) {
		console.log("redirecting to reviews page");
		var id = req.query.inp;
		
				res.render('productreviews',{ID: id});

	})

router.route('/home/reviews')
	.get(function(req,res){
		console.log("in reviews get");
		var id = req.query.inp;
		var query1 = "select * from productreviews where prodidmatch = " +id+ " ORDER BY reviewID DESC";	
		console.log(query1);	
		connection.query(query1, function(err, rows, fields) {
		    if (err)  {
		    	console.log(err);
			} else {
				console.log("successfully sending reviews comments to reviews pagee", rows);
				res.send(rows);
			}
		});
	})

	.post(function(req, res) {
		var id = req.body.ID;
		var user = req.body.user;
		var comment = req.body.comment;
		var rating = parseInt(req.body.rating);
		console.log("in the post section of reviews", id, user, comment, rating);
		var query2 = "insert into productreviews(prodidmatch, custname, custreview, custrating) values("+id+",'"+user+"','"+comment+"',"+rating+");";
		console.log(query2);
		connection.query(query2, function(err, rows, fields) {
			if (err)  {
		    	console.log(err);
		    	res.send("error");
			} else {
				console.log("successfully added");
				res.send("success");
			}
		});
	});

router.route('/home/reviewbar')
	.get(function(req,res){
		console.log("in reviews getting each rating for bar diagram");
		var id = req.query.inp;
		var queryReview = "select custrating, count(*) as count from productreviews where prodidmatch="+id+" GROUP BY custrating ;" ;	
		console.log(queryReview);	
		connection.query(queryReview, function(err, rows, fields) {
		    if (err)  {
		    	console.log(err);
			} else {
				console.log("successfully sending bar data for reviews", rows);
				res.send(rows);
			}
		});
	})

app.use('/', router);
app.listen(8081);


