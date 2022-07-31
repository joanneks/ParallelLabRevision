const bookshelf = require('../bookshelf');

// Convention:
// name of the mode, first character must be uppercase and singular
// first argument to bookshelf.Model is the name of the model
const Poster = bookshelf.model('Poster',{
    'tableName':'products',
    category: function (){
        return this.belongsTo('Category');
    },
    tags: function (){
        return this.belongsToMany('Tag');
    }
})
const Category = bookshelf.model('Category',{
    'tableName':'categories',
    product: function(){
        return this.hasMany('Poster');
    }
})

const Tag = bookshelf.model('Tag',{
    tableName:'tags',
    products: function(){
        return this.belongsToMAny('Product');
    }
})

const User = bookshelf.model('User',{
    tableName:'users',

})

// module.exports = {
//     'Poster':Poster
// }

module.exports = {Poster, Category, Tag, User}