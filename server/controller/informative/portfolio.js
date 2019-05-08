const {
  portfolio,
  services,
} = require('../../database/informativeModel');

exports.get = async (req, res) => {
  try {
    const result = await portfolio.findAll({
      order: [
        ['id', 'DESC'],
      ],
      include: [{
        model: services,
        attributes: ['title'],
      }],
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await portfolio.findOne({ where: { id }, include: [{ model: services, attributes: ['title'] }] });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.post = async (req, res) => {
  try {
    const data = req.body;
    await portfolio.create(data);
    res.status(200).send({
      message: 'Portfolio Item has been added',
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.update = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    await portfolio.update(data, { where: { id } });
    res.status(200).send({
      message: 'Portfolio Item has been updated',
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.delete = async (request, response) => {
  try {
    const {
      id,
    } = request.body;

    await portfolio.destroy({
      where: {
        id,
      },
    });
    response.status(200).send({
      message: 'Success, portfolio has been deleted',
    });
  } catch (error) {
    response.status(500).send({
      message: 'Internal Server Error',
    });
  }
};
