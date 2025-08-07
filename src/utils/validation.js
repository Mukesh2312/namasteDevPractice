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


const validateProfileEditData = (req) => {

    const allowedEditFields = ["firstName", "lastName", "age", "about", "skills", "gender", "photoUrl"];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;





}
module.exports = {
    validateSignUpData,
    validateProfileEditData
}