const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `dinesmart/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });

const uploadSingle = (folder, fieldName = 'image') =>
  multer({ storage: createStorage(folder), limits: { fileSize: 5 * 1024 * 1024 } }).single(fieldName);

const uploadMultiple = (folder, fieldName = 'images', maxCount = 10) =>
  multer({ storage: createStorage(folder), limits: { fileSize: 5 * 1024 * 1024 } }).array(fieldName, maxCount);

// KYC/business documents (FSSAI, PAN, Aadhar, etc.) — accepts photos or scanned PDFs
const createDocStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `dinesmart/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      resource_type: 'auto',
    },
  });

const uploadFields = (folder, fields) =>
  multer({ storage: createDocStorage(folder), limits: { fileSize: 5 * 1024 * 1024 } }).fields(fields);

const deleteImage = async (publicId) => {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { cloudinary, uploadSingle, uploadMultiple, uploadFields, deleteImage };
