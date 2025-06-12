import { Area } from 'react-easy-crop';

/**
 * This is a utility function to create a cropped image.
 *
 * @param {string} imageSrc - The source of the image to crop.
 * @param {Area} pixelCrop - The pixel area to crop.
 * @returns {Promise<File | null>} - A promise that resolves with the cropped image as a File object, or null if cropping fails.
 */
const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<File | null> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get canvas context');
        return resolve(null);
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Failed to create blob from canvas');
            return resolve(null);
          }
          const file = new File([blob], 'croppedImage.jpeg', { type: 'image/jpeg' });
          resolve(file);
        },
        'image/jpeg'
      );
    };
    image.onerror = (error) => {
      console.error('Image loading error:', error);
      reject(error); // Reject the promise on image loading error
    };
  });
};

export default getCroppedImg;
