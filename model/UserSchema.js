const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    googleId : String, //
    schedules : Array, //
    taken_courses : Array, //
    ip_courses : Array, //
    needed_courses : Array, //
    major : String, //
    firstName : String, //
    lastName : String, //
    email : String, //
    imageUrl : String, //
    degreeAudit : Boolean, //Checks if they have made changes to their degree audit
    standing : Number,
    college : Number // 
});

const User = mongoose.model('users' , UserSchema);
module.exports = User;
