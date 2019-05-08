const validatior = require('validator');
const { core, titles, services } = require('../../database/informativeModel');

exports.getTitle = async (req, res) => {
  try {
    const result = await titles.findAll();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
exports.update = async (req, res) => {
  try {
    const data = req.body;
    const updateResult = await titles.update(data, { where: { id: 1 } });
    if (updateResult.length) {
      res.status(200).send({ message: 'Updated' });
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
exports.get = async (req, res) => {
  try {
    const result = await core.findAll({ order: [['id', 'DESC']] });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.post = async (req, res) => {
  try {
    const data = req.body;
    const count = await core.count({ where: {} });
    if (count >= 3) {
      return res.status(400).send({ message: ' you can only add three core items !' });
    }
    await core.create(data);
    return res.status(200).send({ message: 'service has been added' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.delete = (req, res) => {
  try {
    const { id } = req.body;
    core.destroy({
      where: {
        id,
      },
    });
    res.status(200).send({
      message: 'Success, Core item deleted',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
    });
  }
};

exports.getCore = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await core.findAll({ where: { id } });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
    });
  }
};

exports.updateCore = async (req, res) => {
  try {
    const {
      data,
      params: { id },
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
      core.update(data, { where: { id } });
      res.status(200).send({ message: 'Updated is done' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
