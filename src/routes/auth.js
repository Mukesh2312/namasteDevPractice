const express = require("express");
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('../utils/validation');
const { User } = require("../models/user")
const jwt = require("jsonwebtoken");



authRouter.post("/signup", async (req, res) => {

    try {
        // validation data
        validateSignUpData(req);

        const { firstName, lastName, emailId, age, password, skills, about, photoUrl } = req.body;

        const securingPassword = await bcrypt.hash(password, 10)

        // checking duplicate user registration or already exists
        const existingUser = await User.findOne({ emailId: emailId });
        if (existingUser) {
            return res.status(400).send("Email should be unique");
        }
        // console.log(req.body)
        // creating new user and saving in the database
        const user = new User({
            firstName,
            lastName,
            emailId,
            age,
            password: securingPassword,
            photoUrl,
            about,
            skills
        });
        await user.save();
        res.send("user added successfully");
    } catch (error) {
        // console.log(error);
        res.status(400).json({ Error: error.message });
    }
});

// login
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;


        // checking if the user is registered or not
        const isUserPresent = await User.findOne({ emailId: emailId });
        if (!isUserPresent) {
            throw new Error("Error : User is Not found!");
        }

        const isPasswordValid = await isUserPresent.validatePassword(password);

        if (isPasswordValid) {

            const token = await isUserPresent.getJWT();
            // console.log(token)
            // expiring cookie
            res.cookie("token", token, {
                expires: new Date(Date.now() + 900000), httpOnly: true
            });
            res.send("Login Successful");
        }
        else {
            throw new Error("Password is not valid");
        }
    } catch (error) {

        console.log(error);
        res.status(400).json({ Error: error.message });
    }
});

// logout the user
authRouter.post("/logout", (req, res) => {

})





module.exports = { authRouter };