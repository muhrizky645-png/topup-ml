const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// ============================
// AMBIL PRODUK
// ============================

app.get("/products", async (req, res) => {

  try {

    const memberID = "OK1526139";
    const password = "PASSWORD_KAMU";

    const url =
      `https://h2h.okeconnect.com/trx/allprice/JSON?id=${memberID}&key=${password}`;

    const response = await fetch(url);

    const result = await response.json();

    res.json(result);

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }

});


// ============================
// ORDER
// ============================

app.post("/order", async (req, res) => {

  try {

    const {
      product,
      dest
    } = req.body;

    const memberID = "OK1526139";
    const pin = "0509";
    const password = "Rizkysaja123";

    const refID = Date.now();

    const url =
      `https://h2h.okeconnect.com/trx` +
      `?product=${product}` +
      `&dest=${dest}` +
      `&refID=${refID}` +
      `&memberID=${memberID}` +
      `&pin=${pin}` +
      `&password=${password}`;

    const response = await fetch(url);

    const result = await response.text();

    res.json({
      success: true,
      result
    });

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }

});


// ============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
