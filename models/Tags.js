const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    Description:{
        type:String,
        trim:true,
        required:true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
})
module.exports = mongoose.model('Tag', tagSchema);