const UserDao = require('./model/UserDao');
const User = require('./model/UserSchema');
const CourseDao = require('./model/CourseDao');
const Course = require('./model/CourseSchema');
const mongoose = require('mongoose');
const connectionString = process.env.DB || "mongodb://localhost/demodata";
const ScheduleDao = require('./model/ScheduleDao');
const QuarterDao = require('./model/QuarterDao');

mongoose.connect(connectionString).then( () => {
    console.log("The connection has been successwfully made");
}).catch(err => console.log(err));

ScheduleDao.createSchedule({name: "awesome test schedule 1" , quarter: []}).then( res => console.log (res)).catch(err => console.log(err));


