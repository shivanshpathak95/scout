import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength:[4,'Username must be 4 charcters long']
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [4, 'Password must be 4 character long'],
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
},
{
        timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;