const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");


// sending connection request

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ "message": "Invalid status type " + status })
        }
        const isUserPresent = await User.findById(toUserId);
        if (!isUserPresent) {
            return res.status(404).json({ "message": "User not found." });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },

            ],
        });
        if (existingConnectionRequest) {
            return res.status(400).json({ "message": "Connection request already exists." })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const requestData = await connectionRequest.save();
        res.json({
            "message": `Successful`,
            requestData,
        });

    } catch (error) {
        res.status(400).json({ "message": error });
    }
})

module.exports = requestRouter;