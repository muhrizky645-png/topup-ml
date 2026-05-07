require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// ====================================
// ROOT
// ====================================

app.get("/", (req, res) => {

    res.json({
        status: true,
        message: "API Oke Connect Railway Active"
    });

});


// ====================================
// PRODUCTS
// ====================================

app.get("/api/products", async (req, res) => {

    try {

        // AMBIL PRODUK OKE CONNECT
        const response = await axios.get(
            "https://okeconnect.com/harga/json?id=905ccd028329b0a"
        );

        const data = response.data;

        // FILTER MOBILE LEGENDS
        const products = data.filter(item =>
            item.kategori &&
            item.kategori.toLowerCase().includes("mobile legends")
        );

        // FORMAT ULANG
        const result = products.map(item => ({

            code: item.kode,
            name: item.produk,
            price: item.harga,
            category: item.kategori

        }));

        res.json(result);

    } catch (err) {

        console.log(err.message);

        res.status(500).json({
            status: false,
            message: "Gagal mengambil produk"
        });

    }

});


// ====================================
// PORT
// ====================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("Server Running on Port " + PORT);

});
