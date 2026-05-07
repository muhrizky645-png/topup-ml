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
// CEK NICKNAME
// ======================================

app.get("/api/cek-nickname", async (req, res) => {

    try {

        const user_id = req.query.user_id;
        const zone = req.query.zone;
        const game = req.query.game;

        const response = await axios.get(
            `https://cekid.solusimedia.my.id/api/game/${game}/?id=${user_id}&server=${zone}&key=e5771acb669df2b`
        );

        const data = response.data;

        if (data.error_msg) {

            return res.json({
                status: false,
                message: data.error_msg
            });

        }

        res.json({
            status: true,
            nickname: data.nickname
        });

    } catch (err) {

        console.log(err.message);

        res.json({
            status: false,
            message: "Nickname tidak ditemukan"
        });

    }

});


// ======================================
// CHECKOUT BUKAOLSHOP
// ======================================

app.get("/checkout", async (req, res) => {
app.get("/checkout", async (req, res) => {

    try {

        const code = req.query.code;
        const user_id = req.query.user_id;
        const zone = req.query.zone;

        const target = user_id + zone;

        const refid = "TRX" + Date.now();

        // =====================================
        // REQUEST KE BUKAOLSHOP
        // =====================================

        const response = await axios.post(

            "https://bukaolshop.net/api/v1/transaksi/create",

            {

                api_key: process.env.BOS_API_KEY,

                product: code,

                tujuan: target,

                ref_id: refid

            }

        );

        res.send(`

            <h2>TRANSAKSI BERHASIL</h2>

            <pre>
${JSON.stringify(response.data, null, 2)}
            </pre>

        `);

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.send(`

            <h2>CHECKOUT ERROR</h2>

            <pre>
${JSON.stringify(err.response?.data || err.message, null, 2)}
            </pre>

        `);

    }

}

        const result = response.data;

        // =====================================
        // TAMPILKAN HASIL
        // =====================================

        res.send(`

        <html>

        <head>

            <title>Transaksi</title>

            <style>

                body{
                    font-family: Arial;
                    background:#f5f5f5;
                    padding:20px;
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

        console.log(err.response?.data || err.message);

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
