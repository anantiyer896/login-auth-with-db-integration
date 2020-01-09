const express = require("express")
const router = express.Router()

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
    if(errors.length > 0) {
        res.render('register', {
          errors,
          name, email, password, password2  
        })
    }else{
        res.send('pass')
    }

})


module.exports = router;