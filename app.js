const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const pollController = require('./pollController');

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/create', pollController.createPollGetController);
app.post('/create', pollController.createPollPostController);

app.get('/polls', pollController.getAllPolls);
app.get('/polls/:id', pollController.viewPollGetController);
app.post('/polls/:id', pollController.viewPollPostController);

mongoose
  .connect('mongodb://localhost:27017/Poll')
  .then(() => {
    app.listen(5000, () => {
      console.log('Application is on port 5000');
    });
    console.log('Connected to MongoDB...');
  })
  .catch((err) => console.log('Cloud not connect to MongoDB...'));
