var mongoose = require('mongoose');


// define the schema for our user model
var locationSchema = mongoose.Schema({
    timestamp: Number,
    lat: Number,
    lng: Number
})

module.exports = mongoose.model('Location', locationSchema);