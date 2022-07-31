const express = require('express');
const router = express.Router();

const {User} = require('../models');

const {createUserForm, createUserLogin, bootstrapField} = require('../forms');
const crypto = require('crypto');
const getHashedPassword = (password) =>{
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/register',function (req,res){
    const  userForm = createUserForm();
    res.render('users/register',{
        form:userForm.toHTML(bootstrapField)
    })
})

router.post('/register',function(req,res){
    const userForm = createUserForm();
    userForm.handle(req,{
        success: async function (form){
            const user = new User({
                username:form.data.username,
                email:form.data.email,
                password:getHashedPassword(form.data.password)
            });
            await user.save();
            req.flash('success_messages',"User registered successfully!")
            res.redirect('/users/login')

        },
        error: async function (form){
            res.render('users/register',{
                form:form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login',function (req,res){
    const loginForm = createUserLogin();
    res.render('users/login',{
        form:loginForm.toHTML(bootstrapField)
    })
})

router.post('/login',function (req,res){
    const loginForm = createUserLogin();
    loginForm.handle(req,{
        success:async function (form){
            let user = await User.where({
                'email':form.data.email
            }).fetch({
                require:false
            })
            if(!user){
                req.flash('error_messages',"Invalid credentials")
                res.redirect('/users/login')
            } else if(user.get('password')===getHashedPassword(form.data.password)){
                req.session.user={
                    'id': user.get('id'),
                    'email': user.get('email'),
                    'username': user.get('username')
                }
                req.flash("success_message","Welcome back"+user.get('username'))
                res.redirect('/users/profile')
            } else{
                req.flash("error_messages","Invalid credentials")
                res.redirect('/users/login')
            }
        },
        error:async function(form){
            req.flash("error_messages","Invalid credentials")
            res.redirect('/users/login')
        }
    })
})

router.get('/profile',function(req,res){
    const user = req.session.user
    if(!user){
        req.flash("error_messages","You need to be logged in to view this page.")
        res.redirect('/users/login')
    }else{
        res.render('users/profile',{
            user:user
        })
    }
})

router.get('/logout',function(req,res){
    req.session.user = null;
    req.flash("success_messages","You have successfully logged out.");
    res.redirect('/users/login');
})

module.exports = router;