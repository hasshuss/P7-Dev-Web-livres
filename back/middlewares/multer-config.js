const multer = require('multer');
const sharp = require('sharp');
const { DeleteFile } = require('./DeleteFile');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        const finalName = name + Date.now() + '.' + extension;
        callback(null, finalName);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        return cb(new Error('Veuillez télécharger uniquement des images.'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('image');

module.exports = (req, res, next) => {
    upload(req, res, function(err) {
        if (err) {
            return res.send(err);
        }
        if (req.file) {
            const imagePath = 'images/' + req.file.filename;
            sharp(imagePath)
            .resize(500)  
            .toFile('images/resized_' + req.file.filename, (err, info) => {
                if (err) {
                    return next(err);
                }
                req.file.filename = 'resized_' + req.file.filename;
                DeleteFile(imagePath)
        
                console.log('Image redimensionnée');
                next();
            });
        } else {
            next();
        }
    });
};