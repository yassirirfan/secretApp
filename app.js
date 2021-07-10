const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 12;


const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true,useUnifiedTopology: true});

const userSchema = {
    email:String,
    password:String
}

const User = new mongoose.model('user',userSchema);

app.get('/',(req,res) =>{
    res.render('home');
});

app.route('/register')
    .get((req,res) => {
        res.render('register');
    })
    .post((req,res) => {
        let emailId = req.body.username;
        let pswd = req.body.password;

        User.findOne({email:emailId},(err,data) => {
            if(err) res.send('Email already registered');
            else{
                bcrypt.hash(pswd, saltRounds, function(err, hash) {
                    if(!err){
                        const newUser = new User({
                            email:emailId,
                            password:hash
                        })
                        newUser.save((err) => {
                            if(!err)res.redirect('/');
                            else res.send(err)
                        })
                    }
                    else console.log(err)

                })
            }
        })
    })

app.route('/login')
    .get((req,res) => {
        res.render('login');
    })
    .post((req,res) => {
        let emailId = req.body.username;
        let pswd = req.body.password;

        User.findOne({email:emailId} , (err,data) => {
            if(data){
                bcrypt.compare(pswd,data.password, function(err, result) {
                    if(result == true) res.render('secrets');
                    else res.send('Wrong password');
                });
            }
            else res.send('User not found !');
        })
    })



app.listen(3000,()=>{
    console.log('server is running');
})