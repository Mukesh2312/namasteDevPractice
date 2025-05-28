const express = require("express");

const app = express();


app.use("/", (req, res) => {
    res.send("Hello there...")
})
app.use("/first", (req, res) => {
    res.send("this is first route")
})
app.listen(7777, () => {
    console.log("server is running on 7777");
})