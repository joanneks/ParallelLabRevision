const { application } = require('express');
const express = require('express');
const router = express.Router();
const cartServiceLayer = require('../services/cart');


router.get('/', async function(req,res){
    let cartItems = await cartServiceLayer.getCart(req.session.user.id);
    res.render('cart/index',{
        cartItems: cartItems.toJSON()
    })
})


router.get('/:poster_id/add', async function(req,res){
    const userId = req.session.user.id;
    const posterId = req.params.poster_id;
    console.log(userId, posterId)
    await cartServiceLayer.addToCart(userId, posterId,1);
    req.flash('success_messages',"Poster has been added to cart successfully!")
    res.redirect('/cart/');
    
})

router.post('/:poster_id/update',async function(req,res){
    let userId = req.session.user.id;
    let posterId = req.params.poster_id;
    await cartServiceLayer.updateQuantity(userId, posterId,req.body.newQuantity)
    res.redirect('/cart')
})

router.get('/:poster_id/delete',async function (req,res){
    let userId = req.session.user.id;
    let posterId = req.params.poster_id;
    console.log(userId,posterId)
    await cartServiceLayer.removeCartItem(userId, posterId);
    req.flash("success_messages","Item deleted from cart successfully")
    res.redirect('/cart');
})


module.exports = router;