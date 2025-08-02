// const bcrypt = require('bcrypt');
const validator = require('validator');

const validateSignUpData = (req) => {
    let { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not Valid");
    }

    emailId = emailId.trim().toLowerCase();
    req.body.emailId = emailId;

    if (!validator.isEmail(emailId)) {
        throw new Error("Email id is not valid");

    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Password should be strong");
    }




}

module.exports = {
    validateSignUpData,
}