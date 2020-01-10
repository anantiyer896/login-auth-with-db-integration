const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require('passport')

//model
const User = require("../models/Users")


router.get('/login', (req, res) => res.render('Login'))

router.get('/register', (req, res) => res.render('Register'))

//Register Handle
router.post('/register', (req, res) =>{
    const {
        name, email, password, password2
    } = req.body;
    let errors = [];

    if(!name || !email || !password || !password2) {
        errors.push({msg:'please fill all the fields'})
    }
    if(password !== password2) {
        errors.push({msg: 'passwords do not match'})
    }
    if(password.length < 8){
        errors.push({msg: 'password should be more than 8 charecters'})
    }
   if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash('seccessMsg', 'you are now registered')
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//login handle

router.post('/login', (req, res, next) =>{
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})


//logout handle
router.get('/logout', (req, res) => {
  req.logout();
  console.log('logged out')
  req.flash('successMsg', 'you are logged out')
  res.redirect('/users/login')
})

module.exports = router;