const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { afterUploadImage, uploadPost, like, deletePost } = require('../controllers/post');

try{
    fs.readdirSync('uploads');
} catch(error){
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb){
            cb(null, 'uploads/');
        },
        filename(req, file, cb){
            console.log(file);
            const ext = path.extname(file.originalname); // 이미지.png -> 이미지1234321.png
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

router.post('/:id/like', isLoggedIn, like);

router.post('/:id/delete', isLoggedIn, deletePost);

module.exports = router;