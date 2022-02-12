import mongoose from 'mongoose';

let userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    avator : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }
});

let User = mongoose.model("user" , userSchema);

export default User


