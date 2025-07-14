const jwt = require("jsonwebtokens");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
    // reading token from the req cookies
    const { token } = req.cookies;
    // varifying user with the jwt token
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");

    // destructuring _id from the decodedMessage
    const { _id } = decodedMessage;

    // searching user into the database
    const user = await User.findById(_id);
    if (!user) {
        throw new Error("User not found");
    }

    next();



}

module.exports = {
    userAuth,
}