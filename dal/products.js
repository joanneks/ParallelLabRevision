const {Poster, Category, Tag, User} = require('../models')

async function getAllCategories(){
    const categories = await Category.fetchAll().map(category=>{
        return [category.get('id'),category.get('name')];
    }) 
    return categories;
}

async function getAllTags(){
    const tags = await (await Tag.fetchAll()).map(tag=>{
        return [tag.get('id'),tag.get('name')]
    })
    return tags;
}

async function getPosterbyId (posterId){
    const poster = await Poster.where({
        id:posterId
    }).fetch({
        require:true,
        withRelated:['category','tags']
    })
    return poster;
}



module.exports = { getAllCategories, getAllTags, getPosterbyId}
