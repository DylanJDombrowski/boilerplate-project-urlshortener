require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dns = require('dns');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// URL shortening logic
const urlDatabase = {};
let shortId = 1;

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,})' + // domain name and extension
    '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-zA-Z\\d_]*)?$', 'i'); // fragment locator

  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const { hostname } = new URL(originalUrl);
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = shortId++;
    urlDatabase[shortUrl] = originalUrl;
    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
