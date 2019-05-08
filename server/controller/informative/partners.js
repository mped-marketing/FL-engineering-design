const { partners } = require('../../database/informativeModel');

exports.post = async (req, res) => {
  try {
    const data = req.body;
    await partners.create(data);
    res.status(200).send({ message: 'Partner has been added' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await partners.findAll();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await partners.destroy({ where: { id } });
    res.status(200).send({ message: 'partner has been deleted' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await partners.findAll({ where: { id } });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.update = async (request, response) => {
  try {
    const { id } = request.params;
    const data = request.body;
    const {
      name, image,
    } = data;
    if (image && !image.trim()) {
      return response.status(400).send({ message: 'Please choose an image !' });
    }
    if (!name.trim) {
      return response
        .status(400)
        .send({ message: 'Wrong in fields! please fill all the fileds with the right data' });
    }

    await partners.update(data, { where: { id } });
    response.status(200).send({ message: 'Updated ...' });
  } catch (error) {
    return response.status(500).send({ message: 'Internal Server Error' });
  }
};
