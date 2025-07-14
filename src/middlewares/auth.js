const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const userAuth = async (req, res, next) => {
    try {
        // reading token from the req cookies
        console.log(req)
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid Token...!!!!!");
        }
        // verifying user with the jwt token
        const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");

        // destructuring _id from the decodedMessage
        const { _id } = decodedMessage;

        // searching user into the database
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        // creacting user property to req handler and assigning to found user to it
        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({ Error: error.message });
    }



}

module.exports = {
    userAuth,
}