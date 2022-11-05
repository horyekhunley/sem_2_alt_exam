var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var UserModel = new Schema({
    roles: [{
        type: String,
        required: false
    }],
    attributes: [{
        type: String,
        required: false
    }],
});

UserModel.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserModel', UserModel);