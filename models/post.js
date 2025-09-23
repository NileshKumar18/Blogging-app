const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    content : {
        type : String
    },
    date:{
        type : Date,
        default:Date.now,
    },
    like:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "user",
    },
})

module.exports = mongoose.model('post' , postSchema);