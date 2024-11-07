const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Directory containing assets
const assetsDir = './assets/images';

fs.readdir(assetsDir, (err, files) => {
  if (err) {
    console.error('Could not list the directory.', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(assetsDir, file);

    // Read the file and generate a hash
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Could not read file', err);
        return;
      }

      // Create a hash from the file content
      const hash = crypto.createHash('md5').update(data).digest('hex');
      const fileExt = path.extname(file);
      const newFileName = `${path.basename(file, fileExt)}-${hash}${fileExt}`;
      const newFilePath = path.join(assetsDir, newFileName);

      // Rename the file
      fs.rename(filePath, newFilePath, (err) => {
        if (err) {
          console.error('Error renaming file', err);
        } else {
          console.log(`Renamed ${file} to ${newFileName}`);
        }
      });
    });
  });
});
