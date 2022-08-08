const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf');
require("dotenv").config();

var helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
})

const app = express();

app.set('view engine', 'hbs');
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');
app.use(
    express.urlencoded({
      extended: false
    })
  );
  
// ROUTES
// immediatey invoked function
(async function(){
    // use const when we want a variable that cannot be reassigned to
    const landingRoutes = require('./routes/landing');
    const productRoutes = require('./routes/products');
    const userRoutes = require('./routes/users')
    const cloudinaryRoutes = require('./routes/cloudinary')
    const cartRoutes = require('./routes/cart')

    app.use(session({
        store: new FileStore(),
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:true
    }))


    app.use(function (req,res,next){
        res.locals.user = req.session.user;
        next();
    })

    app.use(csrf())
    app.use(function (req,res,next){
        res.locals.csrfToken = req.csrfToken();
        console.log(req.csrfToken())
        next();
    })

    app.use(flash())
    app.use(function(req,res,next){
        res.locals.success_messages=req.flash('success_messages');
        res.locals.error_messages=req.flash('error_messages');
        next();
    })
    
    app.use('/', landingRoutes);
    app.use('/posters', productRoutes);
    app.use('/users', userRoutes);
    app.use('/cloudinary',cloudinaryRoutes);
    app.use('/cart',cartRoutes);
})();

app.listen(3000, function(){
    console.log("Server has started")
});