const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/order", async (req, res) => {

  try {

    const body = {
      memberID: "OK1526139",
      password: "Rizkysaja123",
      pin: "0509",
      product: "DML86",
      dest: "123456789",
      refID: "INV" + Date.now()
    };

    const response = await fetch(
      "https://h2h.okeconnect.com/trx",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    const text = await response.text();

    console.log(text);

    res.send(text);

  } catch (err) {

    res.send(err.message);

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("RUNNING");
});
