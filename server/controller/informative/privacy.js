const { privacy } = require('../../database/informativeModel');

exports.get = async (req, res) => {
  try {
    const result = await privacy.findAll();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { data } = req.body;
    await privacy.update(data, { where: {} });
    res.status(200).send({ message: 'Update is done' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
