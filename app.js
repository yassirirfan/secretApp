const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
        const newUser = new User({
            email:emailId,
            password:pswd
        })
        newUser.save((err) => {
            if(!err)res.send('Successfully Registered');
            else res.send(err)
        })
    })

app.route('/login')
    .get((req,res) => {
        res.render('login');
    })
    .post((req,res) => {
        let emailId = req.body.username;
        let pswd = req.body.password;
        User.findOne({email:emailId},(err,data) => {
            if(!err){
                if(pswd === data.password){
                    res.render('secrets');
                }
                else res.send('Wrong Password');
            }
            else res.send('Sorry you have not registered yet');
        })
    })



app.listen(3000,()=>{
    console.log('server is running');
})