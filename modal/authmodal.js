const mongoose = require('mongoose')

const Userschema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user', 'admin'],
        default:'user'
    },
    resetToken:{
        type:String
    },
    tokenExp:{
        type: Date
    },

    createdAt:{type:Date, default: Date.now}
})

const User = mongoose.model('User', Userschema)

module.exports= User