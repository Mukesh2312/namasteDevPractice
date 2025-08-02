const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 35,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowerCase: true,
        required: true,
        index: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: String,
    },
    gender: {
        type: String,
    },
    photoUrl: {
        type: String,
        default: "https://placehold.co/50",
    },
    skills: {
        type: [String],
    },
    about: {
        type: String,
        default: "This is Default statement",
    }



},
    { timestamps: true }
);

userSchema.methods.getJWT = async function (params) {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
        expiresIn: "1d",
    });

    return token;

};

userSchema.methods.validatePassword = async function (userInputByPassword) {

    const user = this;
    const hashedPassword = user.password;
    // first password is which is coming from req
    const isPasswordValid = await bcrypt.compare(userInputByPassword, hashedPassword);

    return isPasswordValid;



}

const User = mongoose.model("User", userSchema);
module.exports = {
    User,
};