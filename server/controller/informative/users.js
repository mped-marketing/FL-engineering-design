const bcryptjs = require('bcryptjs');
const validator = require('validator');
const { users } = require('../../database/informativeModel');

exports.get = async (request, response) => {
  try {
    const result = await users.findAll({ order: [['id', 'DESC']] });
    response.status(200).send(result);
  } catch (error) {
    response.status(500).send('Server Error');
  }
};

exports.post = async (request, response) => {
  try {
    const { body } = request;
    const {
      email, password, name, pic,rule
    } = body;

    if (
      email
      && email.trim()
      && password
      && name
      && pic
      &&rule
      && password.trim()
      && name.trim()
      && pic.trim()
    ) {
      const result = await users.count({ where: { email } });
      if (result === 0) {
        bcryptjs.hash(password, 10, async (err, hash) => {
          if (err) {
            response.status(500).send('Internal Server Error');
          }
          const newUser = {
            name,
            email,
            password: hash,
            rule,
            pic,
          };
          await users.create(newUser);
          response
            .status(200)
            .send({ message: 'Success, New user has been added' });
        });
      } else {
        response.status(400).send({ message: 'Email is already exist !' });
      }
    } else {
      response.status(400).send({
        message: 'Invalid inputs, please note the type of each input',
      });
    }
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.delete = (req, res) => {
  try {
    const { id, rule } = req.body;
    if (rule !== 'admin') {
      users.destroy({ where: { id } });
      res.status(200).send({ message: 'Success, User is deleted' });
    } else {
      res.status(401).send({ message: 'You can not delete the admin' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await users.findById(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      data,
      params: { id },
    } = req.body;
    const {
      email, name,
    } = data;

    if (
      email.trim()
      && name.trim()
      && validator.isLength(name, { min: 1, max: 20 })
    ) {
      const checkEmail = await users.findOne({ where: { email }, raw: true });
      if (checkEmail && checkEmail.id !== parseInt(id, 10)) {
        res
          .status(400)
          .send({ message: 'Sorry !, this email is already exist' });
      } else if (!data.password) {
        users.update(data, {
          where: { id },
        });
        res.status(200).send({ message: 'Updated is done' });
      } else if (data.password.trim()) {
        bcryptjs.hash(data.password, 10, (err, hashedPass) => {
          if (err) {
            res.status(500).send({ message: 'Internal server Error' });
          }
          data.password = hashedPass;
          users.update(data, {
            where: { id },
          });
          res.status(200).send({ message: 'Updated is done' });
        });
      } else {
        res.status(400).send({
          message: 'Invalid inputs, enter a valid Password',
        });
      }
    } else {
      res.status(400).send({
        message: 'Invalid inputs, please note the type of each input',
      });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.lastUsers = async (req, res) => {
  try {
    const usersData = await users.findAll({ order: [['id', 'DESC']], limit: 5 });
    res.status(200).send(usersData);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req;
    const result = await users.findById(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id, body: { data } } = req;
    const {
      email, name,
    } = data;

    if (
      email.trim()
      && name.trim()
      && validator.isLength(name, { min: 1, max: 20 })
    ) {
      const checkEmail = await users.findOne({ where: { email }, raw: true });
      if (checkEmail && checkEmail.id !== parseInt(id, 10)) {
        res
          .status(400)
          .send({ message: 'Sorry !, this email is already exist' });
      } else if (!data.password) {
        users.update(data, {
          where: { id },
        });
        res.status(200).send({ message: 'Updated is done' });
      } else if (data.password.trim()) {
        bcryptjs.hash(data.password, 10, (err, hashedPass) => {
          if (err) {
            res.status(500).send({ message: 'Internal server Error' });
          }
          data.password = hashedPass;
          users.update(data, {
            where: { id },
          });
          res.status(200).send({ message: 'Updated is done' });
        });
      } else {
        res.status(400).send({
          message: 'Invalid inputs, enter a valid Password',
        });
      }
    } else {
      res.status(400).send({
        message: 'Invalid inputs, please note the type of each input',
      });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
