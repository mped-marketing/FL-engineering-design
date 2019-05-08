/* eslint-disable camelcase */
const validator = require('validator');
const { options, visitors } = require('../../database/informativeModel');

exports.update = async (req, res) => {
  try {
    const newData = req.body;
    const {
      logo,
      contact,
      facebook_number,
      twitter_number,
      instagram_number,
      sound_number,
      snap_number,
      youtub_number,
      facebook,
      twitter,
      whats,
      google,
      about_title,
      about_story,
      mobile,
      email,
      copyrights,
      youtube,
      instagram,
      latitude,
      longitude,
      phone,
      tel,
      fax,
      footer_mobile,
      footer_phone,
    } = newData;

    if (
      (facebook && !validator.isURL(facebook))
      || (twitter && !validator.isURL(twitter))
      || (whats && !validator.isNumeric(whats))
      || (google && !validator.isURL(google))
      || (mobile && !validator.isNumeric(mobile))
      || (email && !validator.isEmail(email))
      || (youtube && !validator.isURL(youtube))
      || (instagram && !validator.isURL(instagram))
      || (copyrights
        && !validator.isLength(copyrights, {
          min: 1,
          max: 70,
        }))
      || (logo
        && !validator.isLength(logo, {
          min: 1,
          max: 15,
        }))
      || (about_title
        && !validator.isLength(about_title, {
          min: 1,
          max: 40,
        }))
      || (about_story
        && !validator.isLength(about_story, {
          min: 1,
          max: 40,
        }))
      || (contact
        && !validator.isLength(contact, {
          min: 1,
          max: 400,
        }))
      || (facebook_number
        && !validator.isLength(facebook_number, {
          min: 1,
          max: 8,
        }))
      || (twitter_number
        && !validator.isLength(twitter_number, {
          min: 1,
          max: 8,
        }))
      || (instagram_number
        && !validator.isLength(instagram_number, {
          min: 1,
          max: 8,
        }))
      || (sound_number
        && !validator.isLength(sound_number, {
          min: 1,
          max: 8,
        }))
      || (snap_number
        && !validator.isLength(snap_number, {
          min: 1,
          max: 8,
        }))
      || (youtub_number
        && !validator.isLength(youtub_number, {
          min: 1,
          max: 8,
        }))
        || (latitude && !validator.isNumeric(latitude))
        || (longitude && !validator.isNumeric(longitude))
        || (phone && !validator.isNumeric(phone))
        || (tel && !validator.isNumeric(tel))
        || (fax && !validator.isNumeric(fax))
        || (footer_mobile && !validator.isNumeric(footer_mobile))
        || (footer_phone && !validator.isNumeric(footer_phone))
    ) {
      res.status(400).send({
        message: 'Invalid inputs, please note the type of each input',
      });
    } else {
      await options.update(newData, {
        where: {
          id: 1,
        },
      });
      res.status(200).send({
        message: 'Updated',
      });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error',
    });
  }
};

exports.get = async (req, res) => {
  try {
    const result = await options.findAll();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({

      message: 'Internal server error',
    });
  }
};

exports.counterPlus = async (request, response) => {
  try {
    const { country } = request.body;
    const current = await visitors.findAndCountAll({
      where: { visitors: country },
    });

    if (current.count === 0) {
      await visitors.create({
        visitors: country,
        count: 1,
      });
    } else {
      const currentCount = await visitors.findOne({
        where: {
          visitors: country,
        },
        attributes: ['count'],
        raw: true,
      });
      const newCount = currentCount.count + 1;
      await visitors.update(
        { count: newCount },
        { where: { visitors: country } },
      );
    }
    response.status(200).send({ message: 'Visit done', country });
  } catch (error) {
    response.status(500).send({
      message: 'Internal server error',
    });
  }
};
