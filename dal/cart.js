const { CartItem } = require('../models');

async function getCart(userId){
    return await CartItem.collection().where({
        user_id:userId
    }).fetch({
        require:false,
        withRelated:['poster','poster.category']
    })
}

async function getCartItemByUserAndPoster(userId, posterId){
    
    return await CartItem.where({
        user_id:userId,
        product_id:posterId
    }).fetch({
        require:false,
        withRelated:['poster','poster.category']
    })
}

async function addCartItem (userId, posterId, quantity){
    let cartItem = new CartItem({
        user_id: userId,
        product_id:posterId,
        quantity: quantity
    })
    await cartItem.save();
    return cartItem;
}


async function updateQuantity(userId,posterId,newQuantity){
    let cartItem = await getCartItemByUserAndPoster(userId, posterId);
    if(cartItem){
        cartItem.set('quantity',newQuantity)
        cartItem.save();
        return true
    }
    return false;
}

async function removeCartItem(userId, posterId){
    let cartItem = await getCartItemByUserAndPoster(userId, posterId);
    if (cartItem){
        cartItem.destroy();
        return true;
    }
    return false;
}

module.exports = {getCart, getCartItemByUserAndPoster, addCartItem, updateQuantity, removeCartItem}