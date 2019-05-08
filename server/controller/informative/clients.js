const validator = require('validator');
const { clients, titles } = require('../../database/informativeModel');


exports.update = async (request, response) => {
  try {
    const { id } = request.params;
    const data = request.body;
    const {
      name, jobTitle, description
    } = data;
    if (
      !name.trim
      || !jobTitle.trim
      || !description.trim()
    ) {
      return response
        .status(400)
        .send({ message: 'Wrong in fields! please fill all the fileds with the right data' });
    }

    const updateResult = await clients.update(data, { where: { id } });
    response.status(200).send({ message: 'Updated ...' });
  } catch (error) {
    return response.status(500).send({ message: 'Internal Server Error' });
  }
};
exports.getOne = async (request, response) => {
  try {
    const { id } = request.params;
    const clientResult = await clients.findByPk(id);
    if (clientResult) {
      response.status(200).send(clientResult);
    } else {
      response.status(400).send({ message: 'Client not found' });
    }
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.updateTitle = async (request, response) => {
  try {
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};
exports.create = async (request, response) => {
  try {
    const data = request.body;
    const {
      name, jobTitle, description,
    } = data;
    if (name.trim() && jobTitle.trim() && description.trim()) {
      await clients.create(data);
      response.status(200).send({ message: 'Added Successfuly, Redirect ...' });
    } else {
      response.status(400).send({ message: 'Please fill all the fields !' });
    }
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getAll = async (request, response) => {
  try {
    const clientsResult = await clients.findAll();
    response.status(200).send(clientsResult);
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.delete = async (request, response) => {
  try {
    const { id } = request.body;
    const { rule } = request;
    if (rule === 'admin') {
      await clients.destroy({ where: { id } });
      response.status(200).send({ message: 'Deleted !' });
    } else {
      response.status(401).send({ message: 'UnAuthorized !' });
    }
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};
