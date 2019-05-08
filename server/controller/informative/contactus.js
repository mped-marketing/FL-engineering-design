const { contactus } = require('../../database/informativeModel');

exports.get = async (req, res) => {
  try {
    const result = await contactus.findAll();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
