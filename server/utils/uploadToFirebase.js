const axios = require('axios');
const bucket = require('./initializeFirebase');
const sharp = require('sharp');

const uploadImageToStorage = async (imageUrl, destinationPath) => {
    try {
      // Fetch the image content from the URL
      const { data } = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  
      // Create a buffer from the image content
      const imageBuffer = Buffer.from(data, 'binary');

      // Compress the image using sharp
      const compressedImageBuffer = await sharp(imageBuffer)
        // .resize({ width: 800 }) // Resize the image to a maximum width of 800 pixels
        .png() // Convert the image to PNG format
        .toBuffer(); // Convert the image to a buffer
  
      // Define the destination file in Firebase Storage
      const file = bucket.file(destinationPath);
  
      // Create a write stream for the file
      const stream = file.createWriteStream({
        metadata: {
          contentType: 'image/png', // Adjust the content type based on your image format
        },
      });
  
      // Write the compressed image buffer to the stream
      stream.end(compressedImageBuffer);
  
      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      const downloadUrl = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2050', // Adjust the expiration date as needed
      });
  
      console.log('Image uploaded to Firebase Storage successfully.');

      return downloadUrl[0];
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
};

module.exports = uploadImageToStorage;