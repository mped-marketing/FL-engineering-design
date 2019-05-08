const cookieParse = require('cookie');
const { verify } = require('jsonwebtoken');
const {
  comments,
  notifications,
  posts,
  categories,
} = require('../../database/informativeModel');
const socket = require('../../socket');

const notify = (request, response, clients, cb) => {
  try {
    clients.map((client) => {
      const token = cookieParse.parse(client.cookie);
      const { jwt } = token;
      if (jwt) {
        verify(jwt, process.env.SECRET, (error, result) => {
          if (result) {
            const { id } = result;
            client.userId = id;
          }
        });
      }
    });
    cb(null, clients);
  } catch (error) {
    cb(error);
  }
};
exports.get = async (request, response) => {
  try {
    const { id, rule } = request;
    if (rule === 'admin') {
      const result = await comments.findAll({
        order: [['id', 'DESC']],
        include: [{ model: posts }],
      });
      return response.status(200).send(result);
    }
    const postsResult = await posts.findAll({
      where: { auther_id: id },
      attributes: ['id'],
      raw: true,
    });
    const postArray = postsResult.map(post => post.id);
    const result = await comments.findAll({
      where: { post_id: { $in: postArray } },
      order: [['id', 'DESC']],
      include: [{ model: posts }],
    });
    return response.status(200).send(result);
  } catch (error) {
    response.status(500).send('Server Error');
  }
};

exports.post = async (request, response) => {
  try {
    const {
      seo, body, name, email,
    } = request.body;
    const postId = await posts.findOne({ where: { seo }, raw: true, attributes: ['id'] });
    if (postId) {
      const { id } = postId;
      const newComment = {
        body, name, email, post_id: id,
      };
      await comments.create(newComment);
      response.status(200).send({ message: 'Your comment has been added, just wait for the approve' });
    } else {
      response.status(400).send('Post not exist');
    }
  } catch (error) {
    response.status(500).send('Server Error');
  }
};
exports.delete = async (req, res) => {
  try {
    const {
      data: { id },
    } = req.body;
    await comments.destroy({ where: { id } });
    res.status(200).send({ message: 'Success, comment is deleted' });
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

exports.update = async (req, res) => {
  try {
    const {
      data: { id },
    } = req.body;
    const commentData = await comments.findByPk(id, {
      attributes: ['approve'],
      raw: true,
    });
    const { approve } = commentData;
    if (approve === '0') {
      await comments.update({ approve: '1' }, { where: { id } });
      res.status(200).send({ message: 'Comment has been updated' });
    } else if (approve === '1') {
      await comments.update({ approve: '0' }, { where: { id } });
      res.status(200).send({ message: 'Comment has been updated' });
    } else {
      res.status(500).send('Internal server error');
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};
