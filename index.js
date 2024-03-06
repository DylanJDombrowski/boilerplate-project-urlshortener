require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();
const shorturls = ["https://freecodecamp.org"];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint

app.get("/api/shorturl/:id", (req, res) => {
  res.redirect(shorturls[req.params.id]);
});

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const id = shorturls.length;
  const domain = new URL(url).host;
  dns.lookup(domain, (err) => {
    if (err) return res.json({ error: "invalid url" });
    shorturls.push(url);
    res.json({ original_url: url, short_url: id });
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
