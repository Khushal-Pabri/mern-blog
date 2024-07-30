const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../configs/enviroment');

exports.register = async (req, res) => {
    try {
        let data = new User(req.body);
        data.password = await bcrypt.hash(data.password, 10);
        let result = await data.save();
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ id: user._id, username: user.username }, secret);
            res.cookie('token', token).json({ id: user._id, username: user.username });
        } else {
            res.status(400).json('Wrong username or password');
        }
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};

exports.profile = async (req, res) => {
    try {
        const { token } = req.cookies;
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) return res.status(403).json('Unauthorized');
            const user = await User.findById(decoded.id).select('-password'); // Fetch user details excluding the password
            if (!user) return res.status(404).json('User not found');
            
            res.json(user);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};

exports.logout = (req, res) => {
    res.cookie('token', '').json('Logged out');
};
