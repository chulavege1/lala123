var express = require('express');
let https = require('request');

var router = express.Router();


// modify there... .
// var telegaBot = require('./telegaBot');

// middleware that is specific to this router
  router.post('/', function(req, res, next) {

  // console.log('reqBody', req.body);

  let reqBody = req.body
  // Elem's to array
  let fields = [
    '<b>The user has selected a token</b>: ' + reqBody.data.left_CurrencyToken_Selected,
    '<b>Deposit amount</b>: ' + reqBody.data.left_AmountToken_deposit_payment,
    '<b>Email</b>: ' + reqBody.data.left_Email,
    '<b>User telegramm</b>: ' + reqBody.data.left_telegram,

    '<b>Withdraw currency type</b>: ' + reqBody.data.right_selectedWithdrawalCurrency,
    '<b>Withdraw value</b>: ' + reqBody.data.right_widthdrawalValue,
    '<b>Bank name</b>: ' + reqBody.data.right_bankName,
    '<b>Iban number</b>: ' + reqBody.data.right_ibanNumber,
    '<b>Company name</b>: ' + reqBody.data.right_companyName,
    '<b>Description</b>: ' + reqBody.data.right_description,
  ]

  // iterate through the array and glue everything into one line
  let msg = ''
  fields.forEach(field => {
    msg += field + '\n'
  });
    // encode the result into text understandable to the address bar
    msg = encodeURI(msg)
  // move request
  https.post(`https://api.telegram.org/bot${'5905791429:AAEszFq4I51W6DtmhahAWBPNiQMxUamrQs0'}/sendMessage?chat_id=${'-1001154757112'}&parse_mode=html&text=${msg}`, function (error, response, body) {  
    // response resolve
    // console.log('error:', error); 
    // console.log('statusCode:', response && response.statusCode); 
    // console.log('body:', body); 
    if(response.statusCode === 200){
      res.status(200).json({status: 'ok', message: 'Успешно отправлено!'});
    }
    if(response.statusCode !== 200){
      res.status(400).json({status: 'error', message: 'Произошла ошибка!'});
    }

  });

  // res.json('hello world');                           :)

});


// define the home page route
// router.get('/about', function (req, res, next) {
  
//   next();

// }, function (req, res) {

//   console.log('req_req_req222', req.body);
//   console.log('req_req_req222', res.body);

//   res.send(
//     telegaBot(req.body)
//   );

// });







module.exports = router;
