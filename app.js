const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/order", async (req, res) => {

    const {
        product,
        userid,
        zone
    } = req.body;

    res.json({
        success: true,
        product,
        userid,
        zone
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});
