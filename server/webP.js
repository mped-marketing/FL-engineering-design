const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const webp = require('imagemin-webp');

(async () => {
  try {
    await imagemin(['./uploads/*.png'], './uploads', {
      plugins: [imageminPngquant({ quality: [0.3, 0.6] })],
    });

    console.log('Images optimized');
    await imagemin(['./uploads/*.jpg'], './uploads', {
      plugins: [imageminMozjpeg({ quality: 50 })],
    });
    console.log('Images optimized');
  } catch (error) {
    console.log(error);
  }
})();
