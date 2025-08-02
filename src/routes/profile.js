const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")

// user profile route 
profileRouter.get("/profile", userAuth, async (req, res) => {
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
        res.status(400).json({ Error: error.message });
    }
});

module.exports = profileRouter;