const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose");
const flash = require("connect-flash")
const session = require("express-session")
const passport = require('passport')
const app = express()

//passport config
require('./config/passport')(passport);


//DB.Config
const db = require('./config/keys').MongoURI;

//Connect to mongo
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
        useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));




//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

 // BodyParser
app.use(express.urlencoded({ extended: false }))

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Vars
app.use((req, res, next) =>{
    res.locals.successMsg = req.flash('secccessful');
    res.locals.errorMsg = req.flash('Please try again')
    res.locals.error = req.flash('error')
    next();
})

//register handle 
app.post('/register')


//routes

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on ${PORT}`))