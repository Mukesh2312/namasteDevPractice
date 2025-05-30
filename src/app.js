const express = require("express");

const app = express();
const port = 5500;


app.get("/user", (req, res) => {
    res.send({ name: "jack", number: 542545 });
})
app.use("/first", (req, res) => {
    res.send("this is first route")
})
app.listen(port, () => {
    console.log("server is running on 5500");
})