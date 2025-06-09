const express = require('express');

const { adminAuth } = require('./middlewares/auth');

const app = express();
const PORT = 5500;

app.use("/admin", adminAuth);
app.get("/", (req, res) => {
    res.send("connected on 5500");
})

app.get("/admin/authentication", (req, res) => {
    res.send("success");
})
app.get("/admin/alldata", (req, res) => {
    res.send("data sent");
})
app.listen(PORT, () => {
    console.log(`server is running on port number ${PORT}`)
})