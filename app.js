app.post("/order", async (req, res) => {

  const axios = require("axios");

  const {
    product,
    userid,
    zone
  } = req.body;

  try {

    const tujuan = userid + zone;

    const response = await axios.post(
      "https://h2h.okeconnect.com/trx",
      {
        userid: "OK1526139",
        password: "Rizkysaja123",
        product: product,
        tujuan: tujuan
      }
    );

    res.json(response.data);

  } catch (err) {

    console.log(err);

    res.json({
      success: false,
      message: "Gagal order"
    });

  }

});
