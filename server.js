// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var path = require('path');

/*const http = require('http').Server(app);
const io = require('socket.io')(http);
io.on('connection', function(socket) { 
    console.log('connected')
  })*/

  console.log("help!")
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static(path.join(__dirname, 'public')));

// required for passport

var sessionMiddleware = session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
})
var http = require('http').createServer(app); 
var io = require('socket.io')(http)
//var io = require("socket.io")(app)
    .use(function(socket, next){
        // Wrap the express middleware
        sessionMiddleware(socket.request, {}, next);
    })
    .on("connection", function(socket){
        var userId = socket.request.session.passport.user;
        console.log("Your User ID is", userId);
        socket.on('disconnect', function(){
            console.log("User Disconnected", userId);
        })
    });
    

app.use(sessionMiddleware)
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

console.log('The magic happens on port ' + port);

http.listen(port);
