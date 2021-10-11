var express = require('express');
var router = express.Router();

const speakeasy = require('speakeasy')
const QRCode = require('qrcode');

// to generate secret for user and google authenticator 
const temp_secret = speakeasy.generateSecret()

router.get('/', async function(req, res, next) {

  // google authenticator use default algorithm sha1
  const url = speakeasy.otpauthURL({ secret: temp_secret.ascii, label: 'Mysabay_User_ID', algorithm: 'sha512', encoding:'ascii', issuer:'Sabay' });
  
  //for example
  const test1 = speakeasy.otpauthURL({ secret: temp_secret.base32, label: 'User_ID', algorithm: 'sha512' , encoding:'base32' });
  
  const qrData = await QRCode.toDataURL(url)
  // send data as qr code image
  res.send('<img src="' + qrData + '">');
});

router.get('/verify', async function(req, res, next) {

  const token = req.body.token;

  const verified = await speakeasy.totp.verify({ secret: temp_secret.base32,
    encoding: 'base32',
    token: token });

  res.send({success: verified});
});

module.exports = router;
