const nodemailer = require('nodemailer');
const { contact, contactus } = require('../../database/informativeModel');

exports.post = async (request, response) => {
  try {
    const {
      name, email, mobile, text,
    } = request.body;
    if (
      name
      && name.trim()
      && email
      && email.trim()
      && mobile
      && mobile.trim()
      && text
      && text.trim()
    ) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        replyTo: email,
        subject: name,
        text,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          response.status(500).send({ message: 'Internal Server Error' });
        } else {
          contactus.create({
            name, email, mobile, message: text,
          }).then(() => {
            response.status(200).send({ message: 'Your Email has been Send' });
          });
        }
      });
    } else {
      response.status(400).send({ message: 'Fill all the fields !' });
    }
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.get = async (req, res) => {
  try {
    const result = await contact.findAll();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    await contact.update(data, { where: {} });
    res.status(200).send({ message: 'Contact Us page has been updated' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
