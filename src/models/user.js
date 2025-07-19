const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
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
    { timestamps: true })

const User = mongoose.model("User", userSchema);
module.exports = {
    User,
};