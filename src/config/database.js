const mongoose = require("mongoose");

const connectDb = async () => {

    await mongoose.connect("mongodb+srv://darkUser:VdBPgdd7X5o5qaCp@learning.xxdlerz.mongodb.net/")
}

connectDb.then(() => {
    console.log("successfull connection");
}).catch((err) => {
    console.log("not connected");

})
