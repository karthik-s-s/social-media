const express = require('express');
const { createPost, getFeed, markPostAsViewed } = require('../controllers/postController');
const verifyToken = require('../utils/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/', verifyToken, upload.single('photo'), createPost);

router.get('/', verifyToken, getFeed);

router.post('/viewed', verifyToken, markPostAsViewed);

module.exports = router;
