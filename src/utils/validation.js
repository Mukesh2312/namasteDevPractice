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

const validateNewPassword = (newPassword, confirmNewPassword, oldPassword) => {

    // const { newPassword, confirmNewPassword, oldPassword } = req.body;
    if (!newPassword || !confirmNewPassword || !oldPassword) {
        throw new Error("All fields are required")
    }
    if (newPassword !== confirmNewPassword) {
        throw new Error("New Password and Confirm Password should be same");
    }
    if (newPassword === oldPassword) {
        throw new Error("New Password should not be your current Password");
    }
    if (oldPassword.length < 8) {
        throw new Error("Password length should be at least 8 characters long");
    }

    if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Password should be strong");
    }

    return true;

}
module.exports = {
    validateSignUpData,
    validateProfileEditData,
    validateNewPassword,
}