const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth")
const { validateProfileEditData, validateNewPassword } = require("../utils/validation")

// user profile route 
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // const cookie = req.cookies;
        // const { token } = cookie;
        // if (!token) {
        //     throw new Error("Invalid Token");
        // }
        // console.log(cookie);

        // const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        // const { _id } = decodedMessage;

        // searching user by id
        // const loggedInUser = await User.findById(_id);
        // console.log(loggedInUser);
        res.send(loggedInUser)
    } catch (error) {
        res.status(400).json({ Error: error.message, err: "jwt not valid" });
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        // validating body
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid Edit fields");

        }
        const loggedInUser = req.user;
        // saving in the loggedIn user 
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        // saving into the db
        await loggedInUser.save();

        res.send(`${loggedInUser.firstName}, your profile is successfully updated`);
    } catch (error) {
        res.status(400).send("Error :" + error.message)
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { newPassword, confirmNewPassword, oldPassword } = req.body;

        // validating password
        validateNewPassword(newPassword, confirmNewPassword, oldPassword);

        // loggedInUser coming from userAuth
        const loggedInUser = req.user;

        // this validatePassword method coming from schema methods
        const isPasswordMatch = await loggedInUser.validatePassword(oldPassword);

        if (!isPasswordMatch) {
            throw new Error("Invalid Credentials");
        }

        // hashing the password before saving it into the database
        loggedInUser.password = await bcrypt.hash(newPassword, 10);

        await loggedInUser.save();
        console.log(isPasswordMatch);

        res.send(`${loggedInUser.firstName}, Your password has been updated successfully `)
    } catch (err) {
        res.status(400).json({ error: err.message })

    }
})
module.exports = profileRouter;