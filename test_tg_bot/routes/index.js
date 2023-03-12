var express = require('express');
const https = require("https");
const http = require("http");

const mongoose = require('mongoose');

var router = express.Router();


// modify there... .
// var telegaBot = require('./telegaBot');

router.post('/', function(req, res, next) {
  console.log('reqBody', req.body);

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

  const TGKEY = '5905791429:AAEszFq4I51W6DtmhahAWBPNiQMxUamrQs0'

  // iterate through the array and glue everything into one line
  let msg = ''
  fields.forEach(field => {
    msg += field + '\n'
  });
  // encode the result into text understandable to the address bar
  msg = encodeURI(msg)

  const options = {
    method: 'POST',
    hostname: 'api.telegram.org',
    path: `/bot${TGKEY}/sendMessage?chat_id=${'-1001154757112'}&parse_mode=html&text=${msg}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const requestTgMessage = https.request(options, (telegramRes) => {
    let data = '';
    telegramRes.on('data', (chunk) => {
      data += chunk;
    });
    telegramRes.on('end', () => {
      console.log('Response:', data);
      const telegramResponse = JSON.parse(data);
      if (telegramResponse && telegramResponse.ok) {
        res.status(200).json({
          message_id: telegramResponse.result.message_id,
          status: 'ok',
          message: 'Успешно отправлено!'
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: 'Произошла ошибка!'
        });
      }
    });
  });

  requestTgMessage.on('error', (error) => {
    console.error('Error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Произошла ошибка!'
    });
  });

  requestTgMessage.end();
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

Commision.find({ })
  .then((user) => {
    console.log('userrrr12312312', user)
  })
  .catch((err) => {
    console.log('ererrerrerrerrerrr', err)
  });
  

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
  router.get('/params', async (req, res) => {
    try {
      const params = await Commision.find();
      res.send(params);
    } catch (err) {
      console.log(err);
      res.status(500).send('Ошибка сервера');
    }
  });

  
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
