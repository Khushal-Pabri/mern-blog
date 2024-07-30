const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
{
    title:{type:String, required:true},
    summary:{type:String, required:true},
    content:{type:String, required:true},
    cover:{type:String, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'users' ,required:true},
    category: { type: String, required: true }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('posts', postSchema);