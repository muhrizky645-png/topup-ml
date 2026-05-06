const express = require("express");

const app = express();

app.use(express.static("public"));

/*
  ROOT
*/
app.get("/", (req, res) => {

  res.send("TOPUP ML SERVER ACTIVE");

});

/*
  GET PRODUCTS
*/
app.get("/products", async (req, res) => {

  try {

    const response =
      await fetch("https://okeconnect.com/harga");

    const html =
      await response.text();

    res.send(html);

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }

});

/*
  TEST ORDER
*/
app.get("/test", async (req, res) => {

  try {

    const memberID = "OK1526139";
    const pin = "0509";
    const password = "Rizkysaja123";

    const product = "DML86";
    const dest = "123456781234";

    const refID =
      Date.now();

    const url =
      `https://h2h.okeconnect.com/trx?product=${product}&dest=${dest}&refID=${refID}&memberID=${memberID}&pin=${pin}&password=${password}`;

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

app.listen(process.env.PORT || 3000, () => {

  console.log("SERVER RUNNING");

});
