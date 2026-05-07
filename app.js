const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
    res.send("SERVER ACTIVE");
});

app.get("/products/ml", async(req,res)=>{

    try{

        const response =
        await axios.get(
            "https://okeconnect.com/harga/json?id=905ccd028329b0a"
        );

        const all =
        response.data.products;

        const ml =
        all.filter(x =>
            x.keterangan &&
            x.keterangan.toLowerCase()
            .includes("mobile legend")
        );

        res.json(ml);

    }catch(err){

        console.log(err.message);

        res.status(500).json({
            success:false,
            message:"gagal ambil produk"
        });

    }

});

app.listen(PORT, ()=>{
    console.log("RUNNING");
});
