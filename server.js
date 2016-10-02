// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var restcalls = require('./config/restcalls');
var path = require('path');

var morgan       = require('morgan');
var bodyParser   = require('body-parser');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url); // connect to our database

// Add headers, for now all 
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

// routes ======================================================================
require('./app/routes')(app, restcalls); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
// console.log('The magic happens on port ' + port);