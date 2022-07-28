const express = require('express');
const { Poster, Category } = require('../models');
const { createProductForm, bootstrapField } = require('../forms')
const router = express.Router();

router.get('/', async function(req,res){
    // SELECT * FROM posters;
    const posters = await Poster.collection().fetch();
    res.render('posters/index',{
        'posters': posters.toJSON()
    })
})

router.get('/create', async function(req,res){
    const categories = await Category.fetchAll().map(category=>{
        return [category.get('id'),category.get('name')];
    })
    const form = createProductForm(categories);
    res.render('posters/create', {
        'form': form.toHTML(bootstrapField)
    })
})

router.post('/create', async function(req,res){
    const categories = await Category.fetchAll().map(category=>{
        return [category.get('id'),category.get('name')];
    })
    const form = createProductForm(categories);
    form.handle(req, {
        'success':async function(form){
            // extract the information from the form to create a new product

            const product = new Poster(); // the model represents one table, one instance == one row in the table
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description)
            product.set('category_id',form.data.category_id)
            await product.save();  // save the data into the database
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
router.get('/update/:product_id', async function(req,res){
    const product = await Product.where({
        'id':req.params.product_id
    }).fetch()
    const categories = await Category.fetchAll().map(category=>{
        return[category.get('id'),category.get('name')];
    });
    const productForm = createProductForm(categories);

    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.category_id.value = product.get('category_id');

    res.render('products/create',{
        'form':productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})
module.exports= router;