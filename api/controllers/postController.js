const fs = require('fs');
const Post = require('../models/Post');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const jwt = require('jsonwebtoken');
const { secret } = require('../configs/enviroment');

exports.createPost = async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const uploadResult = await uploadOnCloudinary(newPath);
    fs.unlinkSync(newPath);

    const { title, summary, content, category } = req.body;
    const { token } = req.cookies;
    jwt.verify(token, secret, async (err, user) => {
        if (err) return res.status(403).json('Unauthorized');
        const post = new Post({ title, summary, content, cover: uploadResult.url, author: user.id, category });
        await post.save();
        res.json(post);
    });
};

// exports.getPosts = async (req, res) => {
//     const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20);
//     res.json(posts);
// };

exports.getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category || '';
    const userId = req.query.userId || '';

    try {
        const query = {};
        if (category) query.category = category;
        if (userId) query.author = userId;
        const posts = await Post.find(query)
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments(query);
        console.log(total);

        res.json({
            posts,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getPost = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author', ['username']);
    res.json(post);
};

exports.updatePost = async (req, res) => {
    let newPath = null;
    let uploadResult = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadResult = await uploadOnCloudinary(newPath);
        fs.unlinkSync(newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, async (err, user) => {
        if (err) return res.status(403).json('Unauthorized');
        const post = await Post.findById(req.params.id);
        if (String(post.author) !== String(user.id)) return res.status(403).json('Unauthorized');
        Object.assign(post, { ...req.body, cover: newPath ? uploadResult.url : post.cover });
        await post.save();
        res.json(post);
    });
};

exports.getUserPosts = async (req, res) => {
    try {
        console.log('hi');
        const { token } = req.cookies;
        jwt.verify(token, secret, async (err, user) => {
            if (err) return res.status(403).json('Unauthorized');
            const posts = await Post.find({ author: user.id })
                .populate('author', ['username'])
                .sort({ createdAt: -1 });
            res.json(posts);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

