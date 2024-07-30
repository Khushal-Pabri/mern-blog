const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 4400;
const NODE_ENV = process.env.NODE_ENV;

const app = express();
require('./configs/config');

app.use(cors({ credentials: true, origin: NODE_ENV === 'production' ? 'https://mern-blog-frontend-fq1j1yhqa-khushal-pabris-projects.vercel.app' : 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(authRoutes);
app.use(postRoutes);

app.get('/keep-alive', (req, res) => {
    res.json("hello world");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
