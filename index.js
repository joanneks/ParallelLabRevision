const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

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

    app.use('/', landingRoutes);
    app.use('/posters', productRoutes)
})();

app.listen(3000, function(){
    console.log("Server has started")
});