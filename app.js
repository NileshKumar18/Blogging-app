const express = require('express');
const app = express();
const userModel = require("./models/user");
const cookieParser = require('cookie-parser');
const user = require('./models/user');
const bcrypt = require('bcrypt');
const postModel = require('./models/post')
const jwt = require('jsonwebtoken');


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// DashBoard Page

app.get('/', (req, res) => {
    res.render("index")


})

// Login Path
app.get('/login', (req, res) => {
    res.render("login")


})

app.get('/profile', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({email : req.user.email}).populate("posts");
    console.log(user);
    
    res.render("profile", { user });
})

// Logout path
app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/login');
})

// Registering The User and hashing the Password and save the User to the DB and Generating the JWT token And setting the cookie
app.post('/register', async (req, res) => {
    const { username, email, password, age } = req.body;
    const user = await userModel.findOne({ email });;
    if (user) {
        res.status(500).send("user already exists");
    }
    else {

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                const userCreated = await userModel.create({
                    username,
                    password: hash,
                    email,
                    age,
                })
                const token = jwt.sign({ email: email, Id: userCreated._id }, "nilesh")
                res.cookie("token", token)
                res.status(201).json({ message: "User created", user: userCreated });


            })
        })
    }


});

// Loging in a User

app.post('/login', async (req, res) => {
    const { email, username, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        res.send("Something  Went wrong");
    }else{
        
    bcrypt.compare(password , user.password, (err, result) => {
        if (result) {
            const token = jwt.sign({ email: email, Id: user._id }, "nilesh");
            res.cookie("token", token);
            res.redirect("/profile" );
        }
        else {
            res.redirect('/login')
        }

    })
    }

})

app.post('/post' , isLoggedIn , async(req,res) => {
    const user =  await userModel.findOne({email : req.user.email}).populate("posts");
    const {content } = req.body;
   const posts = await postModel.create({
        user : user._id,
        content : content,
    })
  
    
    user.posts.push(posts);
    await user.save();
    res.redirect('/profile');
})

function isLoggedIn(req, res, next) {
    if (req.cookies.token == "") {
        res.status(401).send("You are not logged in");
    }
    else {
        const data = jwt.verify(req.cookies.token, "nilesh",)
        req.user = data;
    }
    next();
}

app.listen(4000, () => {
    console.log("server is listening at the port 4000");

})