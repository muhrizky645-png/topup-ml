const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("TOPUP ML SERVER ACTIVE");
});

app.get("/products", async (req, res) => {

  try {

    const memberID = "OK1526139";
    const pin = "0509";

    const url =
      `https://h2h.okeconnect.com/trx?product=${memberID}&pin=${pin}`;

    const response = await fetch(url);

    const text = await response.text();

    res.send(text);

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }

});

app.listen(process.env.PORT || 3000);
