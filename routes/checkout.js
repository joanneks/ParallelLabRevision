const express = require('express');
const router = express.Router();
const cartServiceLayer = require('../services/cart');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/',async function (req,res){
    const cart = await cartServiceLayer.getCart(req.session.user.id);
    let lineItems = [];
    let meta = [];
    for (let item of cart){
        let eachItem = {
            name:this.related("poster").get('name'),
            amount: this.related('poster').get.('amount'),
            quantity:this.quantity,
            currency: "SGD"
        }
        if(item.related('poster').get('image_url')){
            eachItem[image_url]=item.related('poster').get('image_url')
        }
        lineItems.push(eachItem);
        meta.push({
            product_id:item.get('product_id'),
            quantity:item.get('quantity')
        })
    }
    let metaData = JSON.Stringify(meta);

    const payment ={
        payment_method_types:['card'],
        line_items:lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + "?sessionId={CHECKOUT_SESSION_ID}",
        cancel_url:process.env.STRIPE_CANCEL_URL,
        metadata:{
            orders:metadata,
            user_id:req.session.user_id
        }
    }

    let stripeSession = await stripe.checkout.sessions.create(payment);
    res.render('/checkout/checkout',{
        stripeId: stripeSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})


module.exports = router;