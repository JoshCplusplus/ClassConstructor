const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ScheduleSchema = new schema({
    name : String,
    quarters : Array
});

const Schedule = mongoose.model('schedules' , ScheduleSchema);
module.exports = Schedule;