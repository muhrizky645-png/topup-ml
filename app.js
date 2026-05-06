const express = require("express");
const path = require("path");
const axios = require("axios");
const qs = require("qs");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/order", async (req, res) => {

  try {

    const {
      product,
      userid,
      zone
    } = req.body;

    const ref_id = "INV" + Date.now();

    const data = qs.stringify({
      username: "OK1526139",
      api_key: "Rizkysaja123",
      code: product,
      target: userid + zone,
      ref_id: ref_id
    });

    const response = await axios.post(
      "https://h2h.okeconnect.com/trx",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    res.json({
      success: true,
      result: response.data
    });

  } catch (err) {

    res.json({
      success: false,
      error: err.response?.data || err.message
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan");
});
