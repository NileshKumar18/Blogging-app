const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://nileshkumar200518_db_user:T36GQpLALGhxOQ4f@cluster0.bqgkxmn.mongodb.net/dataAssociation")

const userSchema = mongoose.Schema({
    username : String,
    name : String,
    age : Number,
    email : String,
    password : String,
    posts : [{
        type:mongoose.Schema.Types.ObjectId,
        ref : "post"
    }]
})

module.exports = mongoose.model('user' , userSchema);