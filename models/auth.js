const mongoose = require('mongoose');


const LoginSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});


const RegistrationSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    loginID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Login'
    }
})


const loginSchema = mongoose.model('Login', LoginSchema);
const registrationSchema = mongoose.model('Register', RegistrationSchema);
module.exports = {Login: loginSchema, Register: registrationSchema};