const validator = require('validator');
const { team } = require('../../database/informativeModel');


exports.post = async (request, response) => {
  try {
    const data = request.body;
    const {
      name, title, image, twitter, facebook, youtube, instagram,
    } = data;
    if (name.trim() && title.trim() && image.trim()) {
      if (image && !image.trim()) {
        return response.status(400).send({ message: 'Please choose an image !' });
      }
      if (
        (twitter && !validator.isURL(twitter))
            || (youtube && !validator.isURL(youtube))
            || (instagram && !validator.isURL(instagram))
            || (facebook && !validator.isURL(facebook))
      ) {
        return response
          .status(400)
          .send({ message: 'Wrong in fields! please fill all the fileds with the right data' });
      }
      await team.create({ name, title, image });
      response.status(200).send({ message: 'Added Successfuly, Redirect ...' });
    } else {
      response.status(400).send({ message: 'Please fill all the fields !' });
    }
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.get = async (req, res) => {
  try {
    const result = await team.findAll();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.delete = async (request, response) => {
  try {
    const { id } = request.params;
    await team.destroy({ where: { id } });
    response.status(200).send({ message: 'Success, team has been deleted' });
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getOne = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await team.findAll({ where: { id } });
    response.status(200).send(result);
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.update = async (request, response) => {
  try {
    const { id } = request.params;
    const data = request.body;
    await team.update(data, { where: { id } });
    response.status(200).send({ message: 'team has been updated' });
  } catch (error) {
    response.status(500).send({ message: 'Internal Server Error' });
  }
};
