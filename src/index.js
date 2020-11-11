const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const Joi = require('joi')
require('dotenv').config();
const db = require('./db')
const messages = db.get('messages')

const middlewares = require('./middlewares');


const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

const schema = Joi.object().keys({
  name: Joi.string().min(1).max(500).required(),
  message: Joi.string().min(1).max(500).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

app.get('/', (req, res) => {
  messages
    .find()
    .then(allMessages => {
      res.json(allMessages)
    })
});

app.post('/', (req, res) => {
  
    const userMessage = {
      name: req.body.name,
      message: req.body.message,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      date: new Date()
    }
    messages
      .insert(userMessage)
      .then(insertedMessage => {
        res.json(insertedMessage)
      })

  
  
});



app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;


const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
