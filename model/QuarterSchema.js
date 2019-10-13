const mongoose = require('mongoose');
const schema = mongoose.Schema;

const QuarterSchema = new schema({
    courses : Array,
    season : String,
    year : String,
    schedule : String
});

const Quarter = mongoose.model('quarters' , QuarterSchema);
module.exports = Quarter;
