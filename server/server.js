require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const upload =require('./config/multer');
const verifyJWT = require('./middleware/verifyJWT')

// Connect to MongoDB
connectDB();

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware for json 
app.use(express.json());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//serve static files
app.use('/', express.static(path.join(__dirname, '../public')));

//middleware for cookies
app.use(cookieParser());

app.use('/', require('./routes/home'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);

app.use('/categories', require('./routes/api/categories'));
app.use('/contacts', require('./routes/api/contacts'));
app.use('/blogs', upload.single('image') ,require('./routes/api/blogs'));
app.use('/comments', require('./routes/api/comments'));


app.all('*', (req, res) => {

    return  res.status(404).json({ "error": "404 Not Found" });
    // if (req.accepts('html')) {
    //     res.sendFile(path.join(__dirname, 'views', '..' ,'404.html'));
    // } else if (req.accepts('json')) {
    //     res.json({ "error": "404 Not Found" });
    // } else {
    //     res.type('txt').send("404 Not Found");
    // }
});


// Set `strictQuery` to `false` to prepare for the change
mongoose.set('strictQuery', true);
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    const PORT = process.env.port || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}); 