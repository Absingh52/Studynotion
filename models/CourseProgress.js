const mongoose  = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"

    },

    completeVideo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }]
})
module.exports=mongoose.Schema("CourseProgress",courseProgressSchema);