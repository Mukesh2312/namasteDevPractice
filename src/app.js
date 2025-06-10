const express = require('express');

const { adminAuth } = require('./middlewares/auth');
const { connectDb } = require('./config/database');
const { User } = require("./models/user")

const app = express();
const PORT = 5500;

app.use(express.json());
app.get("/", (req, res) => {
    res.send("connected on 5500");
})

app.get("/admin/authentication", (req, res) => {
    res.send("success");
})
app.get("/admin/alldata", (req, res) => {
    res.send("data sent");
})

app.post("/singup", async (req, res) => {

    try {
        const { firstName, lastName, emailId, age, password } = req.body;
        const user = new User({
            firstName,
            lastName,
            emailId,
            age,
            password
        });
        await user.save();
        res.send("user added successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }





});

connectDb().then(() => {
    console.log("successfull connection established to the database");
    app.listen(PORT, () => {
        console.log(`server is running on port number ${PORT}`);
    })
}).catch((err) => {
    console.log("not connected");

})
