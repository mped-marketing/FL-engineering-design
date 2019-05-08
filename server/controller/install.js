const bcryptjs = require('bcryptjs');
const { connection, users, options } = require('../database/informativeModel');

exports.installCheck = async (request, response) => {
  try {
    const schemas = await connection.getQueryInterface().showAllTables();

    if (!schemas.length) {
      return response.status(200).send({ check: true });
    }
    return response.status(200).send({ check: false });
  } catch (error) {
    return response.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.install = async (request, response) => {
  try {
    const schemas = await connection.getQueryInterface().showAllTables();
    if (!schemas.length) {
      const { email, password, pic } = request.body;
      connection.sync().then(() => {
        connection
          .query(
            "INSERT INTO options (facebook,contact,facebook_number,twitter_number, instagram_number,sound_number,snap_number,youtub_number,twitter, logo, copyrights) values('test','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s when an unknown printer took a galley ',1000,2000,3000,4000,5000,6000,'test','test','test') ",
            {},
          )
          .then(async () => {
            bcryptjs.hash(password, 10, async (err, hash) => {
              if (err) {
                response.status(500).send('Internal Server Error');
              } else {
                const adminCreate = await users.create({
                  name: 'admin',
                  email,
                  password: hash,
                  rule: 'admin',
                });
                const logoResult = await options.update({ logo: pic }, { where: { id: 1 } });
                response.status(200).send({ message: 'done' });
              }
            });
          });
      });
    } else {
      return response.status(500).send({ message: 'Internal Server Error' });
    }
  } catch (error) {
    return response.status(500).send({ message: 'Internal Server Error' });
  }
};
