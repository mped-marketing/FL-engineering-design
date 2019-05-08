const { verify } = require('jsonwebtoken');
const { users } = require('../../database/informativeModel');

exports.checkToken = (req, res, next) => {
  const { jwt } = req.cookies;
  if (jwt) {
    verify(jwt, process.env.SECRET, (err, result) => {
      if (err) {
        res.status(401).send({ err: 'unAuthorized, wrong in token' });
      } else {
        const { id, rule } = result;
        req.id = id;
        req.rule = rule;
        next();
      }
    });
  } else {
    res.status(401).send({ err: 'unAuthorized, you are not logged in' });
  }
};

exports.checkAdmin = async (request, response, next) => {
  const { id } = request;
  const userResult = await users.findOne({ where: { id }, raw: true });
  const { rule } = userResult;
  if (rule === 'admin') {
    request.id = id;
    request.rule = rule;
    next();
  } else {
    response.status(401).send({ err: 'unAuthorized, you are not Admin' });
  }
};
