const bycrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { users } = require('../../database/informativeModel');

exports.post = async (request, response) => {
  try {
    const { email: loginEmail, password: loginPassword } = request.body;
    if (loginEmail && loginPassword) {
      if (loginEmail.trim() && loginPassword.trim()) {
        const databaseResult = await users.findAll({
          where: { email: loginEmail },
        });
        if (databaseResult[0]) {
          const { password } = databaseResult[0].dataValues;
          bycrypt.compare(loginPassword, password).then((finalResult) => {
            if (finalResult === false) {
              response.status(401).send('Wrong in username or password');
            } else {
              const { id, rule } = databaseResult[0].dataValues;
              const tokenData = { id, rule };
              sign(tokenData, process.env.SECRET, (errSign, resultCookie) => {
                if (errSign) {
                  response.status(401).send('Wrong in signin !');
                } else {
                  response.cookie('jwt', resultCookie, { maxAge: 6048000000 });
                  response.status(200).send({
                    id, rule, resultCookie, message: 'welcome agein ',
                  });
                }
              });
            }
          });
        } else {
          response.status(401).send('Wrong username / password');
        }
      }
    } else {
      response.status(401).send('Please fill all of the fields !');
    }
  } catch (err) {
    response.status(500).send('Server Error !');
  }
};
