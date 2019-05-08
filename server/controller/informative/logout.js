exports.get = (request, response) => {
  response.clearCookie('io');
  response.status(200).send('Logged out');
};
