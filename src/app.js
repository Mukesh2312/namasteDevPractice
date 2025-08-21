const express = require('express');
const { User } = require("./models/user.js")
const { connectDb } = require('./config/database');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5500;

// middlewares
app.use(express.json());
app.use(cookieParser());

// routers


// importing routers
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile");
const requestRouter = require('./routes/request');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);











// find user by name
// app.get("/user", async (req, res) => {
//     // const email = req.body.emailId;

//     try {
//         const users = await User.find();
//         if (!users) {
//             res.status(404).send("User not found");

//         }
//         else {
//             res.send(users);
//         }
//         // finding all the user data
//         // const users = await User.find({ emailId: email });
//         // if (users.length === 0) {
//         //     res.status(404).send("User not found");
//         // } else {

//         //     res.send(users);
//         // }

//     } catch (error) {
//         consol.log(error);
//         res.status(500).send("Something went wrong...");

//     }


// })

// // feed api fetch all the data from the database user data
// app.get("/feed", async (req, res) => {
//     try {
//         const allUser = await User.find({});
//         res.send(allUser);
//     } catch (error) {
//         consol.log(error);
//         res.status(500).send("Something went wrong...");
//     }
// })

// // delete user by id

// app.delete("/user/:id", async (req, res) => {

//     try {
//         const { id } = req.params;
//         const user = await User.findByIdAndDelete(id);

//         if (!user) {
//             return res.status(404).send("User not Found");
//         }

//         res.send("user deleted successfully");

//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Something went wrong...");
//     }
// })


// // update the database/user
// app.patch("/user/:id", async (req, res) => {
//     const { id } = req.params;
//     const data = req.body;
//     try {

//         // console.log(data)
//         // this line will update the data into the database
//         const userData = await User.findByIdAndUpdate(id, data);

//         if (!userData) {
//             return res.status(404).send("User not Found");
//         }
//         res.send("user updated successfully");

//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Something went wrong...");
//     }


// })

// database connection establishment
connectDb().then(() => {
    console.log("successful connection established to the database");
    app.listen(PORT, () => {
        console.log(`server is running on port number ${PORT}`);
    })
}).catch((err) => {
    console.log(`${err} : Database connection failed`);

})
