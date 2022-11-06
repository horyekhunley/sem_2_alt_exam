const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const UserModel = new Schema({
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