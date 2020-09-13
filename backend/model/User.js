const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  username: String,
  password: String,
  name: String,
  role: String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('userInfo', UserSchema, 'userInfo');