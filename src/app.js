const express = require('express');
const bcrypt = require('bcrypt');

const { userAuth } = require('./middlewares/auth');
const { connectDb } = require('./config/database');
const { User } = require("./models/user")
const { validateSignUpData } = require('./utils/validation');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5500;

app.use(express.json());
app.use(cookieParser());

// routers




app.post("/signup", async (req, res) => {

    try {
        // validation data
        validateSignUpData(req);

        const { firstName, lastName, emailId, age, password, skills, about, photoUrl } = req.body;
        console.log(req.body)
        // hashing password before storing into the database
        const securingPassword = await bcrypt.hash(password, 10)
        // console.log(securingPassword);

        // checking duplicate user registration or already exists
        const existingUser = await User.findOne({ emailId: emailId });
        if (existingUser) {
            return res.status(400).send("Email should be unique");
        }
        // console.log(req.body)
        // creating new user and saving in the database
        const user = new User({
            firstName,
            lastName,
            emailId,
            age,
            password: securingPassword,
            photoUrl,
            about,
            skills
        });
        await user.save();
        res.send("user added successfully");
    } catch (error) {
        // console.log(error);
        res.status(400).json({ Error: error.message });
    }
});

// login
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;


        // checking if the user is registered or not
        const isUserPresent = await User.findOne({ emailId: emailId });
        if (!isUserPresent) {
            throw new Error("Error : User is Not found!");
        }

        const isPasswordValid = await isUserPresent.validatePassword(password);

        if (isPasswordValid) {

            const token = await isUserPresent.getJWT();
            // console.log(token)
            // expiring cookie
            res.cookie("token", token, {
                expires: new Date(Date.now() + 900000), httpOnly: true
            });
            res.send("Login Successful");
        }
        else {
            throw new Error("Password is not valid");
        }
    } catch (error) {

        console.log(error);
        res.status(400).json({ Error: error.message });
    }
})


// user profile route 
app.get("/profile", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // const cookie = req.cookies;
        // const { token } = cookie;
        // if (!token) {
        //     throw new Error("Invalid Token");
        // }
        // console.log(cookie);

        // const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        // const { _id } = decodedMessage;

        // searching user by id
        // const loggedInUser = await User.findById(_id);
        // console.log(loggedInUser);
        res.send(loggedInUser)
    } catch (error) {
        res.status(400).json({ Error: error.message });
    }
})

// sending connection request

app.post("/sendConnnectionRequest", userAuth, async (req, res) => {
    const loggedInUser = req.user;
    res.send(`${loggedInUser.firstName} sent Connection request `);
})



// logout the user
app.post("/logout", (req, res) => {

})
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
    console.log("not connected");

})
