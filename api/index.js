const express = require('express');
const app = express();
const cors = require('cors');//this package is used so that this rever can give data to the react server as by default its not allowed to share info b/w two diff servers
const bodyParser = require('body-parser'); //express by default dosent allow the part body of request to fix that use bodyParser
const cookieParser = require('cookie-parser');

//for password encryption
const bcrypt = require('bcrypt');
const saltRounds = 10;

//json web token
const jwt = require('jsonwebtoken');
const secret = 'yuhgwy548gzg4589zrdrg94ig2ue'

//for handling form data
const multer  = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/' })

//file system
const fs = require('fs');
const { uploadOnCloudinary } = require('./utils/cloudinary');

//config
require('./configs/config');
const port = process.env.PORT || 4400;

//schemas
const User = require('./models/User');
const Post = require('./models/Post');

app.use(cors({
    credentials: true,
    origin: ["https://mern-blog-frontend-kohl-five.vercel.app"]
  }));//for credential we have to set this to true
app.use(bodyParser.json())
app.use(cookieParser())

//app.use('/uploads', express.static(__dirname + '/uploads'));: This line is using the express.static middleware to serve static files from the "uploads" directory.
//uploads is the URL path prefix. This means that any request to URLs starting with "/uploads" will be handled by this middleware.
//express.static(__dirname + '/uploads') is specifying the directory from which to serve the static files. __dirname is a Node.js variable that represents the current directory of the module. So, it's serving static files from the "uploads" directory located in the same directory as the current module.
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get('/', (req, res) => {
    res.json("hello");
});

app.post('/register', async (req, res) => {
    try{
        let data = new User(req.body);
        
        // Hash the password
        data.password = await bcrypt.hash(data.password, saltRounds);

        let result = await data.save();//save in database
        console.log(result);
        res.send(result);
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

app.post('/login', async (req, res) => {
    let user = new User(req.body);

    try{
        //let data = await User.find({"username":{$eq: user.username}});
        //console.log(data);
        //res.send(data);
        const storedUser =  await User.find({"username":{$eq: user.username}});
        //console.log(storedUser[0].password);
        const passOk  = await bcrypt.compare(user.password, storedUser[0].password);

        if(passOk)
        {
            console.log(passOk);
            // res.send(passOk);
            jwt.sign({username: storedUser[0].username, id: storedUser[0]._id}, secret, {}, (err, token)=> {
                if (err) throw err;
                res.cookie('token', token).json({
                    id: storedUser[0]._id,
                    username: storedUser[0].username
                });
            });
        }
        else
        {
            res.status(400).json('wrong username or password');
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//check if token valid
app.get('/profile', async (req, res) => {
    const {token} = req.cookies;//the destructuring assignment const {token} = req.cookies; extracts the token property from req.cookies. After this line, you can use the variable token to refer to the value of the token property, which in this example would be the string "someTokenValue".
    try{
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) throw err;
            res.json(info);
        });
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//logout
app.post('/logout', async (req, res) => {
    const {token} = req.cookies;//the destructuring assignment const {token} = req.cookies; extracts the token property from req.cookies. After this line, you can use the variable token to refer to the value of the token property, which in this example would be the string "someTokenValue".
    try{
        res.cookie('token', '').json('logged out');
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//create-post
//uploadMiddleware.single('file') 'file' is name of the image file we sent
app.post('/send-post', uploadMiddleware.single('file') ,async (req, res) => {
    const {originalname, path} = req.file;//destructuring
    const parts = originalname.split('.');//splitting when we see a dot
    const ext = parts[parts.length - 1];//getting extinsion name by -1 index
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const uploadResult = await uploadOnCloudinary(newPath);
    console.log(uploadResult);
    fs.unlinkSync(newPath);

    const {title, summary, content} = req.body;
    // res.json({title, summary, content});

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {id} = info;

        let data = new Post({
            title,
            summary,
            content,
            cover: uploadResult.url,
            author: id
        });
        
        res.json(data);
    
        let result = await data.save();
        console.log(result);
    });
})

//getting posts from database
//Mongoose's .populate() method is used to automatically replace specified paths in a document with documents from another collection. This is particularly useful when dealing with references or relationships between documents in different collections.

app.get('/get-posts', async(req, res) =>
{
    const posts = await Post.find().populate('author', ['username']).sort({createdAt: -1}).limit(20);
    res.json(posts);
});

//individual post

app.get('/post/:id', async(req, res) =>
{
    const {id} = req.params;
    const post = await Post.findById(id).populate('author', ['username']);
    res.json(post);
});

//update post
app.put('/edit-post/:id', uploadMiddleware.single('file'), async(req, res) =>{
    let newPath = null;
    let uploadResult = null;
    const postid = req.body.postid;
    if(req.file)
    {
        const {originalname, path} = req.file;//destructuring
        const parts = originalname.split('.');//splitting when we see a dot
        const ext = parts[parts.length - 1];//getting extinsion name by -1 index
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);

        uploadResult = await uploadOnCloudinary(newPath);
        console.log(uploadResult);
        fs.unlinkSync(newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const postDoc = await Post.findById(postid);
        console.log(postDoc);
        if(JSON.stringify(postDoc.author) === JSON.stringify(info.id))//as author is type of object id we do JSON stringify
        {
            res.json("ok")
        }
        else
        {
            res.status(400).json('You are not allowed to edit this post');
            throw 'You are not allowed to edit this post'
        }

        let data = await Post.updateOne(
            {
                _id: postid
            },
            {
                title: req.body.title,
                summary: req.body.summary,
                content: req.body.content,
                cover: newPath? uploadResult.url:postDoc.cover
            }
        )

        console.log(data);
    });

});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})