app.post("/order", async (req, res) => {

  try {

    const {
      product,
      userid,
      zone
    } = req.body;

    const ref_id = "INV" + Date.now();

    const params = new URLSearchParams();

    params.append("username", "OK1526139");
    params.append("api_key", "Rizkysaja123");
    params.append("code", product);
    params.append("target", userid + zone);
    params.append("ref_id", ref_id);

    const response = await axios.post(
      "https://h2h.okeconnect.com/trx",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    res.json({
      success: true,
      result: response.data
    });

  } catch (err) {

    res.json({
      success: false,
      error: err.response?.data || err.message
    });

  }

});
