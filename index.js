require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns')
const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI,  { useNewUrlParser: true, useUnifiedTopology: true })
// auto-increment
UrlSchema = mongoose.Schema({
  url: String
});

Urls = mongoose.model('Urls', UrlSchema)
UrlSchema.plugin(AutoIncrement, {inc_field: 'id'})
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
  let regex = /^(https?:\/\/)/

  let regel = /\/.*/g
  let reg = /\/$/
  let or = req.body.url
  let ori = or.replace(reg, "")
  let original = ori.replace(regex, "")
  if (!regex.test(or)){
    res.json({
      error:"Invalid URL"
    })
  }
  else {
  
  dns.lookup(original.replace(regel, ""), function (err, address, family) {
    if (err) {
      res.json({
        error: 'Invalid URL'
      })
    }
      else {
    Urls.exists({url: or}, function(err, data){
      if (err) console.error(err)
      if (data === false){
        let UrlInsert = new Urls({
          url: or
        })
UrlInsert.save()
setTimeout( function(){
  Urls.findOne({url: or},'_id', function(err, data){
  if (err) console.error(err)
  else res.json({
    original_url: or,
    short_url: data._id
  })
})}, 1000)
      } else {
console.log('exsists')
Urls.findOne({url: or},'_id', function(err, data){
  if (err) console.error(err)
  else res.json({
    original_url: or,
    short_url: data._id
  })
})
      }
    })
  
    
  
}
  })
}
})


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

app.get('/api/shorturl/:url', function (req, res) {
  
 Urls.findOne({_id:req.params.url},'url', function(err, data){
  if(err) console.error(err)
  res.redirect(data.url)
 })
})
