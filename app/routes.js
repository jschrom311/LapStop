const Location = require('../app/models/location');
const bodyParser = require('body-parser'); 
const jsonParser = bodyParser.json();
const moment = require('moment')

const fetch = require('node-fetch');

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        fetch('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Canada&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyAgGLqV5QvsPr2KcaFwngu1Yf7AIhqjdxI').then(function(response) {
            return response.json();
        }).then(function(myJson) {
            //console.log(myJson);
        });
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        //sendEmail()
        Location.find().then(loc => {
            console.log("find all locations", loc)
            res.render('profile.ejs', {
                user : req.user,
                locations: loc.reverse(),
                moment: moment
            });
        }).catch(err => console.error(err))
    });

    app.delete('/deletelocation', isLoggedIn, function(req, res){
        console.log(req.body)
        Location.remove({_id:req.body.locationid},function(err){
            if (err) {
                return console.error(err)
            }
            return res.json({deleted:req.body.locationid})
        })
    })

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    let time;
    app.get('/ping', function(req, res) {
        console.log("Your laptop has been compromised", req.user)
        res.json({
            success: true
        })
    });

    app.post("/saveLocation", jsonParser, function(req, res){
        console.log(req.body,req.params,req.query)
        let location = new Location(req.body)
        location.save()
        res.redirect('back');
    })


    

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function sendEmail(){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: EMAIL,
               pass: PASSWORD
           }
       });
       const mailOptions = {
        from: 'jschrom311@gmail.com', // sender address
        to: 'jschrom311@gmail.com', // list of receivers
        subject: 'Subject of your email', // Subject line
        html: '<p>Your html here</p>'// plain text body
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}