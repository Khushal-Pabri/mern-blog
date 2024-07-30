const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{type:String, required:true, min:4, unique:true},
    password:{type:String, required:true, min:8},
},
{
    timestamps: true
});

module.exports = mongoose.model('users', userSchema);