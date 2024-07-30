const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/send-post', authMiddleware, uploadMiddleware.single('file'), postController.createPost);
router.get('/get-posts', postController.getPosts);
router.get('/post/:id', postController.getPost);
router.put('/edit-post/:id', authMiddleware, uploadMiddleware.single('file'), postController.updatePost);
router.get('/user-posts', authMiddleware, postController.getUserPosts);

module.exports = router;
