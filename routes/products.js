const express = require('express');
const { Poster, Category, Tag } = require('../models');
const { createPosterForm, bootstrapField } = require('../forms')
const router = express.Router();

router.get('/', async function(req,res){
    // SELECT * FROM posters;rn [category.get('id').categry.get('name')]
    const posters = await Poster.collection().fetch({
        withRelated: ['category','tags']
    });
    
    res.render('posters/index',{
        'posters': posters.toJSON()
    });
})

router.get('/create', async function(req,res){
    const categories = await Category.fetchAll().map(category=>{
        return [category.get('id'),category.get('name')];
    })
    const tags = await (await Tag.fetchAll()).map(tag=>{
        return [tag.get('id'),tag.get('name')]
    })
    const form = createPosterForm(categories,tags);
    res.render('posters/create', {
        'form': form.toHTML(bootstrapField)
    })
})

router.post('/create', async function(req,res){
    const categories = await Category.fetchAll().map(category=>{
        return [category.get('id'),category.get('name')];
    })
    const tags = await Tag.fetchAll().map(tag=>{
        return [tag.get('id'),tag.get('name')]
    });
    
    const form = createPosterForm(categories,tags);
    form.handle(req, {
        'success':async function(form){
            // extract the information from the form to create a new product

            const poster = new Poster(); // the model represents one table, one instance == one row in the table
            poster.set('name', form.data.name);
            poster.set('cost', form.data.cost);
            poster.set('description', form.data.description)
            poster.set('category_id',form.data.category_id)
            await poster.save();  // save the data into the database

            if (form.data.tags) {
                // form.data.tags will contain the IDs of the selected tag seprated by a comma
                // for example: "1,3"
                await poster.tags().attach(form.data.tags.split(','))
            }
            
            req.flash("success_messages",`New poster ${poster.get('name')} has been successfully created`)
            res.redirect('/posters')
        },
        'error': function(form) {
            res.render('posters/create',{
                'form': form.toHTML(bootstrapField)
            })
        },
        'empty': function(form){
            res.render('posters/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
router.get('/update/:poster_id', async function(req,res){
    const poster = await Poster.where({
        'id':req.params.poster_id
    }).fetch({
        require:true,
        withRelated:'tags'
    })
    const categories = await Category.fetchAll().map(category=>{
        return[category.get('id'),category.get('name')];
    });
    const tags = await (await Tag.fetchAll()).map(tag=>{
        return[tag.get('id'),tag.get('name')]
    })
    const posterForm = createPosterForm(categories,tags);

    // 3. fill the form with the previous values of the product
    posterForm.fields.name.value = poster.get('name');
    posterForm.fields.cost.value = poster.get('cost');
    posterForm.fields.description.value = poster.get('description');
    posterForm.fields.category_id.value = poster.get('category_id');

    // fill in the multi-select for tags
    // product.related('tags') will return an array of tag objects
    // use pluck to retrieve only the id from each tag object
    let selectedTags = await poster.related('tags').pluck('id');
    posterForm.fields.tags.value = selectedTags

    res.render('posters/update',{
        'form':posterForm.toHTML(bootstrapField),
        'poster': poster.toJSON()
    })
})

router.post('/update/:poster_id',async function(req,res){
    //fetch all categories
    const categories = await Category.fetchAll().map(category=>{
        return[category.get('id'),category.get('name')]
    })
    
    //fetch the product we want to update
    const poster = await Poster.where({
        'id':req.params.poster_id
    }).fetch({
        required:true,
        withRelated:'tags'
    })
    const tags = await Tag.fetchAll().map(tag=>{
        return [tag.get('id'),tag.get('name')]
    })
    const posterForm = createPosterForm(categories, tags)

    posterForm.handle(req,{
        'success': async (form) => {
            let {tags,...posterData} = form.data;
            poster.set(posterData);
            await poster.save();

            // get all the selected tags as an array
            let tagIds = tags.split(',').map( id => parseInt(id));
            // get an array that contains the ids of the existing tags
            let existingTagIds = await poster.related('tags').pluck('id');
            console.log(tagIds)
            console.log(existingTagIds)

            // remove all the current tags that are not selected anymore
            let toRemove = existingTagIds.filter( id => tagIds.includes(id) === false)
            console.log(toRemove)

            await poster.tags().detach(toRemove)

            // add in all the tags from the form that are not in the product
            await poster.tags().attach(tagIds);

            res.redirect('/posters')
        },
        'error': async (form) => {
            res.render('/posters/update/:poster_id',{
                'poster':poster.toJSON(),
                'form':form.toHTML(bootstrapField)
            })
        },
        'empty': async (form) => {
            res.render('/posters/update/:poster_id',{
                'poster':poster.toJSON(),
                'form':form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/delete/:poster_id',async function(req,res){
    const poster = await Poster.where({
        id:req.params.poster_id
    }).fetch({
        require:true
    })
    res.render('posters/delete',{
        poster: poster.toJSON()
    })
})

router.post('/delete/:poster_id',async function(req,res){
    const poster = await Poster.where({
        id:req.params.poster_id
    }).fetch({
        require:true
    })
    await poster.destroy()
    res.redirect('/posters')
})
module.exports= router;