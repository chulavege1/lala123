var express = require('express');
let https = require('request');
const mongoose = require('mongoose');
const fs = require('fs');
const https = require("https");

var router = express.Router();

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/www.cyberial.app/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.cyberial.app/fullchain.pem')
};


app.get('/lal', (req, res) => {
  res.send('Hello, World!');
});

https.createServer(options, app).listen(3000, () => {
  console.log('HTTPS server running on port 3000');
});

app.get('/laldva', (req, res) => {
  res.send('Hello, World!');
});

app.listen(5000, () => {
  console.log('HTTP server running on port 80');
});

// modify there... .
// var telegaBot = require('./telegaBot');

// middleware that is specific to this router
  router.post('/', function(req, res, next) {

  // console.log('reqBody', req.body);

  let reqBody = req.body
  // Elem's to array
  let fields = [
    '<b>Language selected</b> ',
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
    console.log('statusCode:', response && response.statusCode); 
    var personOBJ = JSON.parse(body);
    console.log('body:', personOBJ.result.message_id);

    // console.log('message_thread_id:', message_thread_id); 

    if(response.statusCode === 200){
      res.status(200).json({ message_id: personOBJ.result.message_id, status: 'ok', message: 'Успешно отправлено!' });
      
    }
    if(response.statusCode !== 200){
      res.status(400).json({status: 'error', message: 'Произошла ошибка!'});
    }

  });

                

});


// Подключение к базе данных MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/usersdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Соединение с MongoDB установлено'))
  .catch(err => console.error('Ошибка подключения к MongoDB', err));



// Определение схемы и модели для параметров
const paramSchema = new mongoose.Schema({
  commision_value: String,
});

const Commision = mongoose.model('Commision', paramSchema);

// Commision.find({ })
//   .then((user) => {
//     console.log('userrrr12312312', user)
//   })
//   .catch((err) => {
//     console.log('ererrerrerrerrerrr', err)
//   });
  

  router.put('/admin/params/:id', (req, res) => {
    const { commision_value } = req.body; // Получаем параметры из запроса
    const { id } = req.params; // Получаем ID объекта, который нужно обновить

    console.log('qweqweqweqwe', id)
    
    Commision.findByIdAndUpdate(id, { commision_value }, { new: true })
      .then(updatedParam => {
        if (!updatedParam) {
          return res.status(404).send('Не удалось найти параметры для обновления');
        }
        res.send('Параметры обновлены');
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Ошибка обновления параметров', err);
      });
  });



  // Маршрут GET для получения данных из базы данных
  // router.get('/params', async (req, res) => {
  //   try {
  //     const params = await Commision.find();
  //     res.send(params);
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send('Ошибка сервера');
  //   }
  // });

  
// middleware that is specific to this router
  router.post('/admin/params', (req, res) => {
    const { commision_value } = req.body; // Получаем параметры из запроса
    
    // Создаем новый объект Commision и сохраняем его в базе данных
    const newParam = new Commision({ commision_value });
    newParam.save()
      .then( () => res.send('Параметры сохранены'))
      .catch(err => {
        console.error(err);
        res.status(500).send('Ошибка сохранения параметров');
      });
    // Обработчик события при успешном подключении к базе данных

  });






module.exports = router;
