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
// CEK IP RAILWAY
// ======================================

app.get("/myip", async (req, res) => {

    try {

        const response = await axios.get(
            "https://api.ipify.org?format=json"
        );

        res.json(response.data);

    } catch (err) {

        console.log(err.message);

        res.send("Gagal cek IP");

    }

});


// ======================================
// PRODUCTS MOBILE LEGENDS
// ======================================

app.get("/api/products", async (req, res) => {

    try {

        const response = await axios.get(
            "https://okeconnect.com/harga/json?id=905ccd028329b0a"
        );

        const data = response.data;

        const products = data.filter(item =>

            item.kode &&
            item.kode.startsWith("DML")

        );

        const result = products.map(item => ({

            code: item.kode,

            name:
                item.kode.replace("DML", "") +
                " Diamond Mobile Legends",

            price: item.harga,

            category: "Mobile Legends"

        }));

        result.sort((a, b) => {

            const aValue =
                parseInt(a.code.replace("DML", ""));

            const bValue =
                parseInt(b.code.replace("DML", ""));

            return aValue - bValue;

        });

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
// CHECKOUT
// ======================================

app.get("/checkout", async (req, res) => {

    try {

        const code = req.query.code;
        const user_id = req.query.user_id;
        const zone = req.query.zone;

        const target = user_id + zone;

        const refid = Date.now();

        // URL TRANSAKSI
        const trxUrl =
            `https://h2h.okeconnect.com/trx?` +
            `product=${code}` +
            `&dest=${target}` +
            `&refID=${refid}` +
            `&memberID=${process.env.OKE_MEMBER_ID}` +
            `&pin=${process.env.OKE_PIN}` +
            `&password=${process.env.OKE_PASSWORD}`;

        // REQUEST TRANSAKSI
        const response = await axios.get(trxUrl);

        // HASIL RESPONSE
        const result = response.data;

        // TAMPILKAN HASIL
        res.send(`

            <html>

            <head>

                <title>Transaksi</title>

                <style>

                    body{
                        font-family: Arial;
                        padding:20px;
                        background:#f5f5f5;
                    }

                    .card{
                        background:white;
                        padding:20px;
                        border-radius:10px;
                    }

                </style>

            </head>

            <body>

                <div class="card">

                    <h2>Transaksi Diproses</h2>

                    <p><b>Produk:</b> ${code}</p>

                    <p><b>Tujuan:</b> ${target}</p>

                    <hr>

                    <pre>
${JSON.stringify(result, null, 2)}
                    </pre>

                </div>

            </body>

            </html>

        `);

    } catch (err) {

        console.log(err.message);

        res.send("Checkout Error");

    }

});


// ======================================
// CALLBACK
// ======================================

app.get("/callback", async (req, res) => {

    console.log(req.query);

    res.send("Callback OK");

});


// ======================================
// PORT
// ======================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("Server Running on Port " + PORT);

});
