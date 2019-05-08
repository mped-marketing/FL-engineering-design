const validatior = require('validator');
const { services, titles } = require('../../database/informativeModel');

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
    const {
      seo,
    } = data;
    const seoCurrent = await services.count({ where: { seo } });
    if (seoCurrent === 0) {
      titles.update(data, { where: { } });
      res.status(200).send({ message: 'Updated' });
    } else {
      res.status(400).send({ message: 'Sorry !, Service with this Seo Name is already exist' });
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
exports.get = async (req, res) => {
  try {
    const result = await services.findAll({ order: [['id', 'DESC']] });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.post = async (req, res) => {
  try {
    const data = req.body;
    const {
      seo, title, desc, body, icon, tags,
    } = data;
    const seoCurrent = await services.count({ where: { seo } });
    if (seoCurrent === 0) {
      await services.create({
        seo: seo.replace(/\s/g, '').toLowerCase(), title, desc, body, icon, tags,
      });
      res.status(200).send({ message: 'service has been added' });
    } else {
      res.status(400).send({ message: 'Sorry !, Service with this Seo Name is already exist' });
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.delete = (req, res) => {
  try {
    const { id } = req.body;
    services.destroy({
      where: {
        id,
      },
    });
    res.status(200).send({
      message: 'Success, service is deleted',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
    });
  }
};

exports.getService = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.findAll({ where: { id } });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
    });
  }
};

exports.updateServices = async (req, res) => {
  try {
    const {
      data,
      params: { id },
    } = req.body;
    const {
      seo, title, desc, body, icon,
    } = data;
    data.seo = data.seo.replace(/\s/g, '').toLowerCase();
    if (
      !title.trim()
      || !desc.trim()
      || !validatior.isLength(title, { min: 1, max: 80 })
      || !validatior.isLength(seo, { min: 1, max: 30 })
      || !validatior.isLength(seo, { min: 1, max: 300 })

    ) {
      res.status(400).send({
        message: 'Invalid inputs, please note the type of each input',
      });
    } else {
      const serviceCheck = await services.findOne({ where: { seo } });
      if (serviceCheck && serviceCheck.id !== parseInt(id, 10)) {
        res
          .status(400)
          .send({ message: 'Sorry !, Service with this Seo Name is already exist' });
      } else {
        services.update(data, { where: { id } });
        res.status(200).send({ message: 'Updated is done' });
      }
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getBySeo = async (req, res) => {
  try {
    const { seo } = req.params;
    const postResult = await services.findOne({ where: { seo } });
    res.status(200).send(postResult);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
