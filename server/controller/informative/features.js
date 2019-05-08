const { features } = require('../../database/informativeModel');
const validator = require('validator');


exports.updateHomepage = async (req, res) => {
  try {
    const { first, second } = req.body;
    await features.update({ homepage: false }, { where: {} });
    await features.update({ homepage: true }, { where: { id: first } });
    await features.update({ homepage: true }, { where: { id: second } });
    res.status(200).send({ message: 'Updated...' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const featureRsult = await features.findByPk(id);
    res.status(200).send(featureRsult);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
exports.getAll = async (request, response) => {
  try {
    const featuresResult = await features.findAll({ order: [['id', 'DESC']] });
    response.status(200).send(featuresResult);
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};
exports.getAllHome = async (request, response) => {
  try {
    const featuresResult = await features.findAll({ where: { homepage: true } }, { order: [['id', 'DESC']] });
    response.status(200).send(featuresResult);
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.post = async (request, response) => {
  try {
    const data = request.body;
    await features.create(data);
    response.status(200).send({ message: 'Feature has been added' });
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.delete = async (request, response) => {
  try {
    const { id } = request.params;
    await features.destroy({ where: { id } });
    response.status(200).send({ message: 'Success, The feature has been deleted' });
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getOne = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await features.findAll({ where: { id } });
    response.status(200).send(result);
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.update = async (request, response) => {
  try {
    const { id } = request.params;
    const data = request.body;
    await features.update(data, { where: { id } });
    response.status(200).send({ message: 'Feature has been updated' });
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};
