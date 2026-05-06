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

    // FORMAT TUJUAN
    const tujuan = `${userid}${zone}`;

    // KODE PRODUK
    const kodeProduk = "ML86";

    // URL API
    const url =
      `https://h2h.okeconnect.com/trx/trx?memberID=${memberID}&password=${password}&pin=${pin}&product=${kodeProduk}&dest=${tujuan}`;

    console.log(url);

    const response = await fetch(url);

    const text = await response.text();

    res.json({
      success: true,
      result: text
    });

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});
