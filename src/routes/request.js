const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require("../models/connectionRequest");


// sending connection request

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

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