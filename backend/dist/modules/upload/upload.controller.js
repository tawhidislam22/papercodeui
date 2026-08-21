import cloudinary from '../../config/cloudinary.js';
export const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }
    const stream = cloudinary.uploader.upload_stream({ folder: 'papercode' }, (error, result) => {
        if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({ error: 'Upload to Cloudinary failed' });
        }
        return res.status(200).json({ url: result?.secure_url });
    });
    stream.end(req.file.buffer);
};
