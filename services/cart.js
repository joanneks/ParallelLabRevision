const cartDataLayer = require('../dal/cart');


async function addToCart(userId,posterId,quantity){
    const cartItem = await cartDataLayer.getCartItemByUserAndPoster(userId,posterId);
    if (!cartItem){
        console.log("no cart item")
        return await cartDataLayer.addCartItem(userId,posterId,quantity)
    } else {
        console.log("have cart item")
        return await cartDataLayer.updateQuantity(userId,posterId,cartItem.get('quantity') + 1)
    }
    // return true;
}

 async function getCart(userId){
    return cartDataLayer.getCart(userId);
 }

 async function updateQuantity(userId,posterId,newQuantity){
    return cartDataLayer.updateQuantity(userId,posterId,newQuantity);
 }

 async function getCartItemByUserAndPoster(userId, posterId){
    return cartDataLayer.getCartItemByUserAndPoster(userId,posterId);
 }
 
 async function removeCartItem(userId, posterId){
    return cartDataLayer.removeCartItem(userId, posterId);
 }

module.exports = { addToCart, getCart, updateQuantity, removeCartItem, getCartItemByUserAndPoster}