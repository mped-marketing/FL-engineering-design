const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const webp = require('imagemin-webp');

exports.post = (request, response) => {
  try {
    const { file } = request.files;
    const { name, data } = file;
    const splitName = name.split('.');
    const nameOfFile = Date.now()
      .toString(16)
      .toUpperCase();
    const ext = splitName[1];
    const fullName = `${nameOfFile}.${ext}`;
    fs.writeFile(`uploads/${fullName}`, data, async (err) => {
      try {
        if (ext === 'png') {
          await imagemin([`./uploads/${fullName}`], './uploads', {
            plugins: [imageminPngquant({ quality: [0.3, 0.6] })],
          });

          response.send({ fullName });
        }
        if (ext === 'jpeg' || ext === 'jpg') {
          await imagemin([`./uploads/${fullName}`], './uploads', {
            plugins: [imageminMozjpeg({ quality: 50 })],
          });

          response.send({ fullName });
        }

        response.send({ fullName });
      } catch (error) {
      }
    });
  } catch (error) {
    console.log(error);
  }
};
exports.postIcon = (request, respone) => {
  const { file } = request.files;
  const { data } = file;
  fs.writeFile('client/home/img/favicon.ico', data, (err) => {
    fs.writeFile('client/admin/build/favicon.ico', data, (err) => {
      respone.send('favicon.ico');
    });
  });
};

exports.remove = (request, response) => {
  const { pic } = request.body;
  fs.unlink(`uploads/${pic}`, (err) => {
    if (err) response.status(500).send({ message: 'Internal Server Error' });
    response.send({ message: 'File Deleted' });
  });
};

exports.get = (request, response) => {
  const { name } = request.params;
  response.sendFile(path.join(__dirname, '..', '..', '..', 'uploads', name));
};

exports.getFav = (request, response) => {
  const { name } = request.params;
  response.sendFile(path.join(__dirname, '..', '..', '..', 'client', 'home', 'img', name));
};
