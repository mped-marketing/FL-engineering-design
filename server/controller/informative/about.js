const validatior = require('validator');
const { about, aboutItem } = require('../../database/informativeModel');

exports.getItem = async (request, response) => {
  const {
    id,
  } = request.params;
  try {
    const itemResult = await aboutItem.findByPk(id);
    response.status(200).send(itemResult);
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};
exports.getItems = async (request, response) => {
  try {
    const itemsRsult = await aboutItem.findAll({ order: [['id', 'DESC']] });
    response.status(200).send(itemsRsult);
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};
exports.get = async (request, response) => {
  try {
    const aboutResult = await about.findOne({ where: {} });
    response.status(200).send(aboutResult);
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      data,
    } = req.body;    
    const { title, desc } = data;
    if (
      !title.trim()
            || !desc.trim()
            || !validatior.isLength(title, { min: 1, max: 30 })
    ) {
      res.status(400).send({
        message: 'Invalid inputs, please note the type of each input',
      });
    } else {
      about.update(data, { where: {} });
      res.status(200).send({ message: 'Updated is done' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const { title } = data;
    if (
      !title.trim()
              || !validatior.isLength(title, { min: 1, max: 30 })
    ) {
      res.status(400).send({
        message: 'Invalid inputs, please note the type of each input',
      });
    } else {
      aboutItem.update(data, { where: { id } });
      res.status(200).send({ message: 'Updated is done' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
