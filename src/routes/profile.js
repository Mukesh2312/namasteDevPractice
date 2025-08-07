const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const { validateProfileEditData } = require("../utils/validation")

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
        // saving in the loggedin user 
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

module.exports = profileRouter;