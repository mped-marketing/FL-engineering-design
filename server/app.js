const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const informative = require('./controller/informative');

const app = express();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app
  .set('port', process.env.PORT || 5001)
  .set('mailer', transporter)
  .disable('x-powered-by')

  .use(fileUpload())
  .use(cookieParser())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    if (req.protocol === 'http') {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  })
  .use('/api/v2', informative)

  .use(express.static(path.join(__dirname, '..', 'client', 'home')))
  .use(express.static(path.join(__dirname, '..', 'client', 'admin', 'build')))


  .get('/admin*', (req, res) => {
    res.sendFile(
      path.join(__dirname, '..', 'client', 'admin', 'build', 'index.html'),
    );
  })
  .get('/blogs', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'home', 'blogs.html'));
  })
  .get('/portfolio-gallery', (req, res) => {
    res.sendFile(
      path.join(__dirname, '..', 'client', 'home', 'portfolio-gallery.html'),
    );
  })
  .get('/blog/:seo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'home', 'blog.html'));
  })
  .get('/hero/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'home', 'Hero.html'));
  })
  .get('/categories', (req, res) => {
    res.sendFile(
      path.join(__dirname, '..', 'client', 'home', 'categories.html'),
    );
  })
  .get('/service/:seo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'home', 'service.html'));
  })
  .get('/feature', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'home', 'feature.html'));
  })
  .get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'home', 'contact.html'));
  })
  .get('/features', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'Home', 'features.html'));
  })
  .get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'home', 'services.html'));
  })
  .get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'home', 'about.html'));
  })

  .get('/portfolio/:id', (req, res) => {
    res.sendFile(
      path.join(__dirname, '..', 'client', 'home', 'singlePortfolio.html'),
    );
  })
  .get('/whyus', (req, res) => {
    res.sendFile(
      path.join(__dirname, '..', 'client', 'home', 'whyus-page.html'),
    );
  })
  .get('/privacy', (req, res) => {
    res.sendFile(
      path.join(__dirname, '..', 'client', 'home', 'privacy.html'),
    );
  })
  .get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'home', 'error.html'));
  });

module.exports = app;
