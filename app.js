const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(cors());
app.use(express.json());

/*
====================================
CONFIG OKECONNECT
====================================
*/

const MEMBER_ID = "OK1526139";
const PIN = "0509";
const PASSWORD = "Rizkysaja123";

/*
====================================
ROOT
====================================
*/

app.get("/", (req, res) => {

  res.send("TOPUP ML SERVER ACTIVE");

});

/*
====================================
GET LIST PRODUK
====================================
*/

app.get("/products", async (req, res) => {

  try {

    const response = await axios.get(
      "https://okeconnect.com/harga"
    );

    const html = response.data;

    const $ = cheerio.load(html);

    let products = [];

    $("table tbody tr").each((i, el) => {

      const cols = $(el).find("td");

      const kategori =
        $(cols[0]).text().trim();

      const kode =
        $(cols[1]).text().trim();

      const nama =
        $(cols[2]).text().trim();

      if (
        kode &&
        nama
      ) {

        products.push({
          kategori,
          kode,
          nama
        });

      }

    });

    res.json({
      success: true,
      total: products.length,
      products
    });

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }

});

/*
====================================
TRANSAKSI
====================================
*/

app.post("/order", async (req, res) => {

  try {

    const {
      product,
      dest
    } = req.body;

    if (!product || !dest) {

      return res.json({
        success: false,
        message: "product & dest wajib"
      });

    }

    const refID =
      Date.now();

    const url =
      `https://h2h.okeconnect.com/trx?product=${product}&dest=${dest}&refID=${refID}&memberID=${MEMBER_ID}&pin=${PIN}&password=${PASSWORD}`;

    const response =
      await axios.get(url);

    res.send(response.data);

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }

});

/*
====================================
CEK STATUS TRANSAKSI
====================================
*/

app.get("/status/:id", async (req, res) => {

  try {

    const id = req.params.id;

    const url =
      `https://h2h.okeconnect.com/status?memberID=${MEMBER_ID}&password=${PASSWORD}&id=${id}`;

    const response =
      await axios.get(url);

    res.send(response.data);

  } catch (err) {

    res.json({
      success: false,
      error: err.message
    });

  }

});

/*
====================================
START SERVER
====================================
*/

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "SERVER RUNNING ON PORT " + PORT
  );

});
