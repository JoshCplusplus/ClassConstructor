const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CourseSchema = new schema({
    id : String,
    department : String,
    course_number : String,
    units : Array,
    description : String,
    prereqs : Array,
    postreqs : Array,
    prereq_string : String,
    quarter_offered : {
        FA : {
            qCnt : Number,
            years_back : Number,
            percent_offer : Number
        },
        WI : {
            qCnt : Number,
            years_back : Number,
            percent_offer : Number
        },
        SP : {
            qCnt : Number,
            years_back : Number,
            percent_offer : Number
        },
        S1 : {
            qCnt : Number,
            years_back : Number,
            percent_offer : Number
        },
        S2 : {
            qCnt : Number,
            years_back : Number,
            percent_offer : Number
        }
    }
});

const Course = mongoose.model('courses' , CourseSchema);
module.exports = Course;
