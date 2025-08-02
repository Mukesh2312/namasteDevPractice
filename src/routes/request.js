const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');


// sending connection request

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const loggedInUser = req.user;
    res.send(`${loggedInUser.firstName} sent Connection request `);
})

module.exports = requestRouter;