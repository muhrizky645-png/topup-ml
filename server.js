require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// ======================================
// ROOT
// ======================================

app.get("/", (req, res) => {

    res.json({
        status: true,
        message: "API OKE CONNECT ACTIVE"
    });

});


// ======================================
// PRODUCTS MOBILE LEGENDS
// ======================================

app.get("/api/products", async (req, res) => {

    try {

        // AMBIL DATA OKE CONNECT
        const response = await axios.get(
            "https://okeconnect.com/harga/json?id=905ccd028329b0a"
        );

        const data = response.data;

        // FILTER PRODUK DML
        const products = data.filter(item =>

            item.kode &&
            item.kode.startsWith("DML")

        );

        // FORMAT PRODUK
        const result = products.map(item => ({

            code: item.kode,

            // CONTOH:
            // DML86 -> 86 Diamond Mobile Legends
            name: item.kode.replace("DML", "") + " Diamond Mobile Legends",

            price: item.harga,

            category: "Mobile Legends"

        }));

        // SORT BERDASARKAN JUMLAH DIAMOND
        result.sort((a, b) => {

            const aValue = parseInt(a.code.replace("DML", ""));
            const bValue = parseInt(b.code.replace("DML", ""));

            return aValue - bValue;

        });

        // RESPONSE
        res.json(result);

    } catch (err) {

        console.log(err.message);

        res.status(500).json({

            status: false,
            message: "Gagal mengambil produk"

        });

    }

});


// ======================================
// PORT
// ======================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("Server Running on Port " + PORT);

});
