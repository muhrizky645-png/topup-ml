const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const MEMBERID = "USERNAME_OKECONNECT";
const APIKEY = "APIKEY_OKECONNECT";

app.post("/order", async (req, res) => {

    try {

        const { product, dest } = req.body;

        const ref_id =
        "TRX" + Date.now();

        const signature =
        require("crypto")
        .createHash("md5")
        .update(MEMBERID + APIKEY + ref_id)
        .digest("hex");

        const response =
        await axios.post(
            "https://vip.okeconnect.com/api/member/transaksi",
            new URLSearchParams({

                memberID: MEMBERID,
                pin: APIKEY,
                password: APIKEY,

                kode_produk: product,
                tujuan: dest,

                ref_id: ref_id

            }),
            {
                headers:{
                    "Content-Type":
                    "application/x-www-form-urlencoded"
                }
            }
        );

        res.json(response.data);

    } catch(err){

        res.json({
            success:false,
            error:err.message
        });

    }

});

app.listen(3000);
