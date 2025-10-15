const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest")


let userSafeData = "firstName lastName skills age photoUrl";
// get all the received connection request
userRouter.get("/user/connections/received", userAuth, async (req, res) => {
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
});


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionsList = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ]
        })
            .populate("fromUserId", userSafeData)
            .populate("toUserId", userSafeData)

        console.log(connectionsList)
        const data = connectionsList.map((row) => {

            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        });

        res.json({ message: "data received successfully", data })
    } catch (error) {
        res.status(400).json({ message: "Something went wrong", error: error.message })

    }
})
module.exports = userRouter;