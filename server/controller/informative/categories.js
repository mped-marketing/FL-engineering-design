const { categories } = require('../../database/informativeModel');

exports.getAll = async (request, response) => {
  try {
    const categoriesResult = await categories.findAll({ order: [['id', 'DESC']] });
    response.status(200).send(categoriesResult);
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.post = async (request, response) => {
  try {
    const data = request.body;
    await categories.create(data);
    response.status(200).send({ message: 'category has been added' });
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.delete = async (request, response) => {
  try {
    const { id } = request.params;
    await categories.destroy({ where: { id } });
    response.status(200).send({ message: 'Success, The category has been deleted' });
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getOne = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await categories.findByPk(id);
    response.status(200).send(result);
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.update = async (request, response) => {
  try {
    const { id } = request.params;
    const data = request.body;
    await categories.update(data, { where: { id } });
    response.status(200).send({ message: 'category has been updated' });
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};
