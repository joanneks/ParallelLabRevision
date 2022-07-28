const bookshelf = require('../bookshelf');

// Convention:
// name of the mode, first character must be uppercase and singular
// first argument to bookshelf.Model is the name of the model
const Poster = bookshelf.model('Poster',{
    'tableName':'products',
    category: function (){
        return this.belongsTo('Category');
    }
})
const Category = bookshelf.model('Category',{
    'tableName':'categories',
    product: function(){
        return this.hasMany('Product');
    }
})

// module.exports = {
//     'Poster':Poster
// }

module.exports = {Poster, Category}