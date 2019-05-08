/* eslint-disable camelcase */
const validator = require('validator');
const { posts } = require('../../database/informativeModel');
const { users, comments } = require('../../database/informativeModel');

exports.getBySeo = async (req, res) => {
  try {
    const { seo } = req.params;

    const postResult = await posts.findOne({ where: { seo }, raw: true });
    if (postResult) {
      const { id } = postResult;
      const commentsResult = await comments.findAll({
        where: { post_id: id, approve: '1' },
        order: [['id', 'DESC']],
      });
      res.status(200).send({ postResult, commentsResult });
    }
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: 'Internal Server Error' });
  }
};
exports.getAllPosts = async (req, res) => {
  try {
    const result = await posts.findAll({
      order: [['id', 'DESC']],
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
exports.getAll = async (req, res) => {
  const { id, rule } = req;
  try {
    const result = await posts.findAll({
      order: [['id', 'DESC']],
      include: [
        {
          model: users,
          attributes: ['name'],
        },
      ],
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
exports.changeState = async (requeset, response) => {
  try {
    const { id, approve } = requeset.body;
    let changeStateResult;
    if (approve) {
      changeStateResult = await posts.update(
        { approve: !approve, hero: false },
        { where: { id } },
      );
    } else {
      changeStateResult = await posts.update(
        { approve: !approve },
        { where: { id } },
      );
    }
    if (changeStateResult) {
      response.status(200).send({ message: 'Post has been updated ...' });
    } else {
      response.status(500).send('Internal server error');
    }
  } catch (error) {
    response.status(500).send('Internal server error');
  }
};
exports.delete = async (req, res) => {
  const { rule, id: userId } = req;
  try {
    const { id } = req.body;
    posts.destroy({
      where: {
        id,
      },
    });
    res.status(200).send({
      message: 'Success, post is deleted',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
    });
  }
};

exports.getPost = async (req, res) => {
  const { rule, id: userId } = req;
  try {
    const { id } = req.params;
    const result = await posts.findAll({
      where: {
        id,
      },
    });

    if (result.length) {
      res.status(200).send(result);
    } else {
      res.status(404).send({
        message: 'Post not found !',
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
    });
  }
};
exports.post = async (req, res) => {
  try {
    const data = req.body;
    const { rule } = req;
    const { id } = req;
    const {
      title, blog_intro, header_media, description, seo,tags
    } = data;
    if (
      blog_intro
      && blog_intro.trim()
      && validator.isLength(blog_intro, { min: 0, max: 260 })
      && blog_intro.trim()
      && title
      && title.trim()
      && description
      && description.trim()
      && header_media
      && header_media.length
      && seo
      && validator.isLength(seo, { min: 0, max: 50 })
    ) {
      const auther_id = id;
      const seoName = await posts.count({ where: { seo } });
      if (seoName === 0) {
        posts
          .create({
            title,
            header_media,
            post_intro: blog_intro,
            description,
            tags,
            auther_id,
            approve: true,
            seo: seo.replace(/\s/g, '').toLowerCase(),
          })
          .then(() => {
            res.status(200).send({
              message: 'New post has been added, Redirect to Posts list ...',
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: 'Internal Server Error',
            });
          });
      } else {
        res.status(401).send({
          message: 'This seo is exists, please add another one',
        });
      }
    } else {
      res.status(401).send({
        message: 'Invalid inputs, please note the type of each input',
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id: userId, rule } = req;
    const {
      data,
    } = req.body;

    const { id } = req.params;
    const {
      post_intro, title, header_media, description, seo,tags
    } = data;
    if (
      !post_intro.trim()
      || !validator.isLength(post_intro, { min: 0, max: 260 })
      || !title.trim()
      || !validator.isLength(title, { min: 0, max: 150 })
      || !description.trim()
      || !header_media.length
      || !validator.isLength(seo, { min: 0, max: 50 })
    ) {
      res.status(401).send({
        message: 'Invalid inputs, please note the type of each input',
      });
    } else {
      const postCheck = await posts.findOne({ where: { seo } });
      if (postCheck && postCheck.id !== parseInt(id, 10)) {
        res
          .status(400)
          .send({ message: 'Sorry !, Post with this Seo Name is already exist' });
      } else {
        posts.update({
          post_intro, title, header_media,tags, description, seo: seo.replace(/\s/g, '').toLowerCase(),
        }, {
          where: {
            id,
          },
        });
        res.status(200).send({
          message: 'Update is done, Redirect to Posts list ...',
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: 'Internal Server Error',
    });
  }
};
