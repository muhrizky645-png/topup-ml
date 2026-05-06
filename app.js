const express = require("express");
const path = require("path");

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

    // DATA OKECONNECT
    const memberID = "OK1526139";
    const password = "Rizkysaja123";
    const pin = "0509";

    // PRODUK
    const kodeProduk = "DML86";

    // TUJUAN
    const dest = userid + zone;

    // REF ID
    const refID = Date.now();

    // URL FIX
    const url =
      `https://h2h.okeconnect.com/trx?product=${kodeProduk}&dest=${dest}&refID=${refID}&memberID=${memberID}&pin=${pin}&password=${password}`;

    console.log(url);

    const response = await fetch(url);

    const text = await response.text();

    console.log(text);

    res.send(text);

  } catch (err) {

    res.send(err.message);

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
