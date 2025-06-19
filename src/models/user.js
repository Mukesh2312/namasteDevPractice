const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,

    },
    password: {
        type: String
    },
    age: {
        type: String
    },
    gender: {
        type: String
    },



},
    { timestamps: true })

const User = mongoose.model("User", userSchema);
module.exports = {
    User,
};