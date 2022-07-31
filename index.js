const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session)

var helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
})

const app = express();

app.set('view engine', 'hbs');
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// ROUTES
// immediatey invoked function
(async function(){
    // use const when we want a variable that cannot be reassigned to
    const landingRoutes = require('./routes/landing');
    const productRoutes = require('./routes/products');

    app.use(session({
        store: new FileStore(),
        secret:'keyboard cat',
        resave:false,
        saveUninitialized:true
    }))

    app.use(flash())
    app.use(function(req,res,next){
        res.locals.success_messages=req.flash('success_messages');
        res.locals.error_messages=req.flash('error_messages');
        next();
    })

    app.use('/', landingRoutes);
    app.use('/posters', productRoutes)
})();

app.listen(3000, function(){
    console.log("Server has started")
});