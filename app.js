const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.static("public"));

app.get("/products", async (req, res) => {

  try {

    const memberID = "OK1526139";
    const pin = "0509";

    const url =
      `https://h2h.okeconnect.com/harga?id=${memberID}&pin=${pin}`;

    const response =
      await fetch(url);

    const text =
      await response.text();

    res.send(text);

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }

});

app.listen(process.env.PORT || 3000);
