const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");


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
        // const data = connectionsList.map((row) => {
        //     const fromId = row.fromUserId?._id;
        //     const toId = row.toUserId?._id;
        //     if (!fromId || !toId) return null;
        //     return fromId.equals(loggedInUser._id) ? row.toUserId : row.fromUserId;
        // }).filter(Boolean);
        console.log(data)
        res.json({ message: "data received successfully", data })
    } catch (error) {
        res.status(400).json({ message: "Something went wrong", error: error.message })

    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 20 : limit;
        let skip = (page - 1) * limit;

        // finding all the request belongs to loggedInUser
        // loggedInUser either fromUserId or toUserId
        // because sender maybe fromUserId or toUserId


        // select function will only give selected fields
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ]
        }).select("fromUserId toUserId");

        // .populate("fromUserId", "firstName").populate("toUserId", "firstName")

        // Set() data structure will only take unique values
        const hideUserFromUserFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUserFromUserFeed.add(req.fromUserId.toString());
            hideUserFromUserFeed.add(req.toUserId.toString());
        })

        // console.log(hideUserFromUserFeed)
        const user = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromUserFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
            .select(userSafeData)
            .skip(skip)
            .limit(limit);
        res.json({ data: user });
    } catch (error) {
        res.status(400).json({ message: "Something went wrong", error: error.message })

    }
})
module.exports = userRouter;