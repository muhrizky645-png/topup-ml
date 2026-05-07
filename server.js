require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));





/*
====================================================
TEST MODE MEMBER BUKAOLSHOP
====================================================
ISI MANUAL UNTUK TESTING
====================================================
*/

const member_id = "ISI_ID_MEMBER_BUKAOLSHOP";
const token_user = "ISI_TOKEN_USER_BUKAOLSHOP";





/*
====================================================
API TOKEN BUKAOLSHOP
====================================================
*/

const BUKAOLSHOP_TOKEN =
process.env.BUKAOLSHOP_TOKEN;





/*
====================================================
OKE CONNECT
====================================================
*/

const OKE_MEMBER_ID =
process.env.OKE_MEMBER_ID;

const OKE_PASSWORD =
process.env.OKE_PASSWORD;

const OKE_PIN =
process.env.OKE_PIN;





/*
====================================================
CHECKOUT
====================================================
*/

app.post("/checkout", async (req, res) => {

    try {

        const {
            userId,
            serverId,
            productCode,
            productName,
            price
        } = req.body;





        /*
        ============================================
        CEK SALDO MEMBER BUKAOLSHOP
        ============================================
        */

        const saldoResponse = await axios.get(

            `https://openapi.bukaolshop.net/v1/member/saldo?token=${BUKAOLSHOP_TOKEN}&id_user=${member_id}&token_user=${token_user}`

        );



        const saldo =
        saldoResponse.data.data.saldo || 0;





        if (saldo < price) {

            return res.send(`

            <html>

            <body style="
                font-family:sans-serif;
                padding:20px;
                background:#f2f2f2;
            ">

                <div style="
                    background:white;
                    padding:20px;
                    border-radius:10px;
                ">

                    <h1>SALDO TIDAK CUKUP</h1>

                    <hr>

                    <p>
                        Saldo member tidak mencukupi
                    </p>

                    <p>
                        Saldo : Rp ${saldo}
                    </p>

                    <p>
                        Harga : Rp ${price}
                    </p>

                </div>

            </body>

            </html>

            `);

        }





        /*
        ============================================
        POTONG SALDO MEMBER
        ============================================
        */

        await axios.post(

            "https://openapi.bukaolshop.net/v1/member/kurang_saldo",

            {

                token: BUKAOLSHOP_TOKEN,
                id_user: member_id,
                token_user: token_user,
                nominal: price,
                keterangan:
                `Topup ${productName}`

            }

        );





        /*
        ============================================
        TRANSAKSI OKE CONNECT
        ============================================
        */

        const refId =
        Date.now();

        const tujuan =
        serverId
        ? `${userId}${serverId}`
        : userId;





        const okeUrl =

        `https://h2h.okeconnect.com/trx?product=${productCode}&dest=${tujuan}&refID=${refId}&memberID=${OKE_MEMBER_ID}&pin=${OKE_PIN}&password=${OKE_PASSWORD}`;





        const trx = await axios.get(okeUrl);





        /*
        ============================================
        TAMPILAN BERHASIL
        ============================================
        */

        res.send(`

        <html>

        <head>

            <title>Transaksi</title>

        </head>

        <body style="
            margin:0;
            font-family:sans-serif;
            background:#f2f2f2;
        ">

            <div style="
                background:#2196f3;
                color:white;
                padding:18px;
                font-size:28px;
                font-weight:bold;
            ">
                Transaksi
            </div>

            <div style="
                padding:20px;
            ">

                <div style="
                    background:white;
                    border-radius:12px;
                    padding:20px;
                ">

                    <h1>
                        Transaksi Diproses
                    </h1>

                    <p>
                        <b>Produk:</b>
                        ${productName}
                    </p>

                    <p>
                        <b>Tujuan:</b>
                        ${tujuan}
                    </p>

                    <p>
                        <b>Harga:</b>
                        Rp ${price}
                    </p>

                    <hr>

                    <pre style="
                        white-space:pre-wrap;
                        font-size:14px;
                    ">${JSON.stringify(trx.data, null, 2)}</pre>

                </div>

            </div>

        </body>

        </html>

        `);





    } catch (err) {

        res.send(`

        <html>

        <body style="
            margin:0;
            font-family:sans-serif;
            background:#f2f2f2;
        ">

            <div style="
                background:#2196f3;
                color:white;
                padding:18px;
                font-size:28px;
                font-weight:bold;
            ">
                Checkout Error
            </div>

            <div style="
                padding:20px;
            ">

                <div style="
                    background:white;
                    border-radius:12px;
                    padding:20px;
                ">

                    <h1>
                        CHECKOUT ERROR
                    </h1>

                    <hr>

                    <pre style="
                        color:red;
                        white-space:pre-wrap;
                    ">${JSON.stringify(err.response?.data || err.message, null, 2)}</pre>

                </div>

            </div>

        </body>

        </html>

        `);

    }

});





/*
====================================================
RUN SERVER
====================================================
*/

const PORT =
process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        "Server running on port " + PORT
    );

});==
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
