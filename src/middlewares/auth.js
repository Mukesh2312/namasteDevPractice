const adminAuth = (req, res, next) => {
    console.log("auth is checked");
    const token = "abc";
    const isAdminAuthorized = token === "abc";

    if (isAdminAuthorized) {
        next();
    } else {
        res.status(401).send("Unauthorized access");
    }
}

module.exports = {
    adminAuth,
}