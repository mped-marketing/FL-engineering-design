const { users } = require('../../database/informativeModel');

exports.get = async (req, res) => {
  try {
    const { id } = req;
    const result = await users.findAll({ attributes: ['name', 'pic', 'id'], where: { id } });
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send('Server Error !');
  }
};
