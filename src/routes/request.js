const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");


// sending connection request

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        // params
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // only allowed fields in params
        const allowedStatus = ["ignored", "interested"];

        // if there are other status types rather than allowedStatus it will give error
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ "message": "Invalid status type " + status })
        }
        // checking if there are genuine user that we are sending to request
        const isUserPresent = await User.findById(toUserId);
        if (!isUserPresent) {
            return res.status(404).json({ "message": "User not found." });
        }

        // checking if there are existing request request in the db
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },

            ],
        });
        // if there are existing request it will throw an error
        if (existingConnectionRequest) {
            return res.status(400).json({ "message": "Connection request already exists." })
        }

        // creating instance of request

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        // saving that request instance into the db
        const requestData = await connectionRequest.save();
        res.json({
            "message": `Successful`,
            requestData,
        });

    } catch (error) {
        res.status(400).json({ "message": error });
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const { status, requestId } = req.params;


        // only allowed status types
        const allowedStatus = ["accepted", "rejected"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ Error: "Invalid Status Type" });
        }

        // checking connection request into the db

        // creating instance
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser,
            status: "interested",
        });


        // if not found it will throw error to the user
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection Request not found." });
        }
        // changed the status into the instance
        connectionRequest.status = status;

        // saving instance into the database
        const data = await connectionRequest.save();

        // sending the response to the user
        res.json({ message: "Connection request " + status, data })


    } catch (error) {
        res.status(400).send("Error :", error)
    }
})

module.exports = requestRouter;