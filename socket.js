
var User       = require('./app/models/user');
var sendEmail = require('./sendemail')
module.exports = function(io){
//var io = require("socket.io")(app)
    io.on("connection", function(socket){
        if (socket.request.session.passport){
            var userId = socket.request.session.passport.user;
        }
        else {
            var userId = null;
        }
        console.log("Your User ID is", userId);
        socket.on('disconnect', function(){
            console.log("User Disconnected", userId);
        })
        socket.on('close', function(){
            console.log("User Close", userId);
            User.findById(userId).exec().then(user=>{
                sendEmail(user.local.email)
                console.log('user is ',user)
            }).catch(err => console.error(err))
        })
    });    
};

