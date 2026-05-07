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
        message: "API TOPUP ML ACTIVE"
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

        res.send("Gagal cek IP");

    }

});


// ======================================
// AMBIL PRODUK OKECONNECT
// ======================================

let products = [];

async function loadProducts() {

    try {

        const response = await axios.get(
            "https://okeconnect.com/harga/json?id=905ccd028329b0a"
        );

        const data = response.data;

        const filtered = data.filter(item =>

            item.kode &&
            item.kode.startsWith("DML")

        );

        products = filtered.map(item => ({

            code: item.kode,

            name:
                item.kode.replace("DML", "") +
                " Diamond Mobile Legends",

            price: parseInt(item.harga),

            category: "Mobile Legends"

        }));

        products.sort((a, b) => {

            const aValue =
                parseInt(a.code.replace("DML", ""));

            const bValue =
                parseInt(b.code.replace("DML", ""));

            return aValue - bValue;

        });

        console.log("Produk berhasil dimuat");

    } catch (err) {

        console.log("Gagal load produk");

    }

}

// LOAD PRODUK AWAL
loadProducts();


// ======================================
// API PRODUCTS
// ======================================

app.get("/api/products", async (req, res) => {

    res.json(products);

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

            `https://cekid.solusimedia.my.id/api/game/${game}/` +
            `?id=${user_id}` +
            `&server=${zone}` +
            `&key=e5771acb669df2b`

        );

        const data = response.data;

        if (data.error_msg) {

            return res.json({
                status: false,
                message: data.error_msg
            });

        }

        return res.json({
            status: true,
            nickname: data.nickname
        });

    } catch (err) {

        return res.json({
            status: false,
            message: "Nickname tidak ditemukan"
        });

    }

});


// ======================================
// CHECKOUT
// ======================================

app.get('/checkout', async (req, res) => {

    try {

        const code = req.query.code;
        const user_id = req.query.user_id;
        const zone = req.query.zone;

        // MEMBER BUKAOLSHOP
        const member_id = req.query.member_id;
        const token_user = req.query.token_user;

        // =========================
        // VALIDASI LOGIN MEMBER
        // =========================

        if (!member_id || !token_user) {

            return res.send(`

                <html>

                <body style="font-family:sans-serif;padding:20px;">

                    <h1>LOGIN MEMBER DIPERLUKAN</h1>

                    <p>
                        Website harus dibuka dari aplikasi
                        BukaOlshop
                    </p>

                </body>

                </html>

            `);

        }

        // =========================
        // CARI PRODUK
        // =========================

        const product = products.find(p => p.code == code);

        if (!product) {

            return res.send(`

                <html>

                <body style="font-family:sans-serif;padding:20px;">

                    <h1>PRODUK TIDAK DITEMUKAN</h1>

                </body>

                </html>

            `);

        }

        // =========================
        // HARGA
        // =========================

        const harga = parseInt(product.price);

        // =========================
        // CEK SALDO MEMBER
        // =========================

        const saldoResponse = await axios.get(

            `https://openapi.bukaolshop.net/v1/member/saldo` +

            `?token=${process.env.BUKAOLSHOP_API_KEY}` +
            `&token_user=${token_user}` +
            `&id_user=${member_id}`

        );

        const saldoMember = parseInt(
            saldoResponse.data.data.saldo
        );

        // =========================
        // SALDO TIDAK CUKUP
        // =========================

        if (saldoMember < harga) {

            return res.send(`

                <html>

                <body style="font-family:sans-serif;background:#f5f5f5;padding:20px;">

                    <div style="background:white;padding:20px;border-radius:10px;">

                        <h1 style="color:red;">
                            SALDO TIDAK CUKUP
                        </h1>

                        <hr>

                        <p>
                            Saldo :
                            Rp ${saldoMember}
                        </p>

                        <p>
                            Harga :
                            Rp ${harga}
                        </p>

                    </div>

                </body>

                </html>

            `);

        }

        // =========================
        // POTONG SALDO MEMBER
        // =========================

        await axios.post(

            `https://openapi.bukaolshop.net/v1/member/saldo` +
            `?token=${process.env.BUKAOLSHOP_API_KEY}`,

            {

                id_user: member_id,
                token_user: token_user,
                tipe: "kurang",
                jumlah: harga,
                catatan: `Pembelian ${product.name}`

            }

        );

        // =========================
        // REF ID
        // =========================

        const ref_id = "ML" + Date.now();

        // =========================
        // TRANSAKSI OKECONNECT
        // =========================

        const trx = await axios.get(

            `https://h2h.okeconnect.com/trx` +

            `?product=${code}` +
            `&dest=${user_id}${zone}` +
            `&refID=${ref_id}` +
            `&memberID=${process.env.OKE_MEMBER_ID}` +
            `&pin=${process.env.OKE_PIN}` +
            `&password=${process.env.OKE_PASSWORD}`

        );

        const hasil = trx.data;

        // =========================
        // JIKA GAGAL
        // =========================

        if (
            hasil.includes("GAGAL") ||
            hasil.includes("ERROR")
        ) {

            // KEMBALIKAN SALDO

            await axios.post(

                `https://openapi.bukaolshop.net/v1/member/saldo` +
                `?token=${process.env.BUKAOLSHOP_API_KEY}`,

                {

                    id_user: member_id,
                    token_user: token_user,
                    tipe: "tambah",
                    jumlah: harga,
                    catatan: `Refund ${product.name}`

                }

            );

            return res.send(`

                <html>

                <body style="font-family:sans-serif;background:#f5f5f5;padding:20px;">

                    <div style="background:white;padding:20px;border-radius:10px;">

                        <h1 style="color:red;">
                            TRANSAKSI GAGAL
                        </h1>

                        <hr>

                        <pre>${hasil}</pre>

                        <hr>

                        <p>
                            Saldo dikembalikan
                        </p>

                    </div>

                </body>

                </html>

            `);

        }

        // =========================
        // SUKSES
        // =========================

        return res.send(`

            <html>

            <body style="font-family:sans-serif;background:#f5f5f5;padding:20px;">

                <div style="background:white;padding:20px;border-radius:10px;">

                    <h1 style="color:green;">
                        TRANSAKSI BERHASIL
                    </h1>

                    <hr>

                    <p>
                        Produk :
                        ${product.name}
                    </p>

                    <p>
                        Tujuan :
                        ${user_id} (${zone})
                    </p>

                    <p>
                        Harga :
                        Rp ${harga}
                    </p>

                    <hr>

                    <pre>${hasil}</pre>

                </div>

            </body>

            </html>

        `);

    } catch (err) {

        console.log(err.response?.data || err.message);

        return res.send(`

            <html>

            <body style="font-family:sans-serif;background:#f5f5f5;padding:20px;">

                <div style="background:white;padding:20px;border-radius:10px;">

                    <h1 style="color:red;">
                        CHECKOUT ERROR
                    </h1>

                    <hr>

                    <pre>
${JSON.stringify(err.response?.data || err.message, null, 2)}
                    </pre>

                </div>

            </body>

            </html>

        `);

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
