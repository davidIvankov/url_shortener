require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns')

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
let urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', function (req, res) {
  let regex = /^(https:\/\/)/
  let regel = /\/\w+/g
  let ori = req.body.url
  let original = ori.replace(regex, "")
  dns.lookup(original.replace(regel, ""), function (err, address, family) {
    if (err) {
      res.json({
        error: 'invalid url'
      })
    } else if (!urls.includes(ori)) {
      urls.push(ori)
      res.json({
        original_url: ori,
        short_url: urls.indexOf(ori)
      })
    } else {
      res.json({
        original_url: ori,
        short_url: urls.indexOf(ori)
      })
    }
  })


})
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.get('/api/shorturl/:short?', function (req, res) {
  let url = urls[req.params.short]
  res.redirect(url)
})