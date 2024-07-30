const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
require('./configs/config');

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(authRoutes);
app.use(postRoutes);

app.get('/', (req, res) => {
    res.json("hello");
});

app.listen(4400, () => {
    console.log('Server is running on port 4400');
});
