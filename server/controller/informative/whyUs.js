const validatior = require('validator');
const { whyus } = require('../../database/informativeModel');


exports.getWhyus = async (req, res) => {
  try {
    const result = await whyus.findAll();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
    });
  }
};

exports.updateWhyus = async (req, res) => {
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
      whyus.update(data, {
        where: { id: 1 },
      });
      res.status(200).send({ message: 'Updated is done' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
