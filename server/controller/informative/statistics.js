const { statistics } = require('../../database/informativeModel');

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const statisticResult = await statistics.findByPk(id);
    res.status(200).send(statisticResult);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.post = async (req, res) => {
  try {
    const data = req.body;
    await statistics.create(data);
    res.status(200).send({ message: 'statistic has been added' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.get = async (req, res) => {
  try {
    const result = await statistics.findAll({
      order: [['id', 'DESC']],
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.delete = async (request, response) => {
  try {
    const { id } = request.params;
    await statistics.destroy({ where: { id } });
    response.status(200).send({ message: 'Success, Statistic has been deleted' });
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};


exports.update = async (request, response) => {
  try {
    const { id } = request.params;
    const data = request.body;
    await statistics.update(data, { where: { id } });
    response.status(200).send({ message: 'statistic has been updated' });
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};
