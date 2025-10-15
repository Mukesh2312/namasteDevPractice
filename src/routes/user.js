const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest")

// get all the received connection request
userRouter.get("/user/connection/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequestReceived = await ConnectionRequest.find({
            toUserId: loggedInUser,
            status: "interested",
        }).populate("fromUserId", "firstName lastName skills age photoUrl")

        res.json({ message: "Data received", data: connectionRequestReceived })
    } catch (error) {
        res.status(400).json({ message: "Something went wrong", error: error.message })
    }
})
module.exports = userRouter;