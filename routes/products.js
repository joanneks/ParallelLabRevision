const express = require('express');
const { Poster, Category } = require('../models');
const { createPosterForm, bootstrapField } = require('../forms')
const router = express.Router();

router.get('/', async function(req,res){
    // SELECT * FROM posters;rn [category.get('id').categry.get('name')]
    const posters = await Poster.collection().fetch({
        withRelated: 'category'
    });
    
    res.render('posters/index',{
        'posters': posters.toJSON()
    })
})

router.get('/create', async function(req,res){
    const categories = await Category.fetchAll().map(category=>{
        return [category.get('id'),category.get('name')];
    })
    const form = createPosterForm(categories);
    res.render('posters/create', {
        'form': form.toHTML(bootstrapField)
    })
})

router.post('/create', async function(req,res){
    const categories = await Category.fetchAll().map(category=>{
        return [category.get('id'),category.get('name')];
    })
    const form = createPosterForm(categories);
    form.handle(req, {
        'success':async function(form){
            // extract the information from the form to create a new product

            const poster = new Poster(); // the model represents one table, one instance == one row in the table
            poster.set('name', form.data.name);
            poster.set('cost', form.data.cost);
            poster.set('description', form.data.description)
            poster.set('category_id',form.data.category_id)
            await poster.save();  // save the data into the database
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
    }).fetch()
    const categories = await Category.fetchAll().map(category=>{
        return[category.get('id'),category.get('name')];
    });
    const posterForm = createPosterForm(categories);

    posterForm.fields.name.value = poster.get('name');
    posterForm.fields.cost.value = poster.get('cost');
    posterForm.fields.description.value = poster.get('description');
    posterForm.fields.category_id.value = poster.get('category_id');

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
        required:true
    })
    
    const posterForm = createPosterForm(categories)

    posterForm.handle(req,{
        'success': async (form) => {
            poster.set(form.data);
            poster.save();
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