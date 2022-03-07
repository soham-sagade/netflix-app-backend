const mongoose = require('mongoose');
const cryptoJS = require('crypto-js');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilepic: {
        type: String,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


userSchema.pre('save', function() {
    const user = this;
    if(user.isModified('password')) {
        user.password = cryptoJS.AES.encrypt(user.password, process.env.SECRET_KEY).toString();
    }
})

module.exports = mongoose.model('User', userSchema);