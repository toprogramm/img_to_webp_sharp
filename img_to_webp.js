const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the path to your directory: ', (inputDir) => {
  rl.question('Enter the desired quality (1-100): ', (quality) => {
    rl.close();

    const supportedExtensions = ['.jpg', '.jpeg', '.png'];
    const maxWidth = 2000;

    fs.readdir(inputDir, (err, files) => {
      if (err) {
        return console.error('Error reading directory:', err);
      }

      files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (supportedExtensions.includes(ext)) {
          const inputPath = path.join(inputDir, file);
          const outputFileName = `${path.basename(file, ext)}_webp.webp`;
          const outputPath = path.join(inputDir, outputFileName);

          sharp(inputPath)
            .metadata()
            .then(metadata => {
              if (metadata.width > maxWidth) {
                return sharp(inputPath)
                  .resize({ width: maxWidth })
                  .webp({ quality: parseInt(quality) })
                  .toFile(outputPath);
              } else {
                return sharp(inputPath)
                  .webp({ quality: parseInt(quality) })
                  .toFile(outputPath);
              }
            })
            .then(info => {
              console.log('Image converted successfully:', info);
            })
            .catch(err => {
              console.error('Error converting image:', err);
            });
        }
      });
    });
  });
});

