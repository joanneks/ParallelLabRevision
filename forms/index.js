const forms = require('forms');
const widgets = forms.widgets;
const fields = forms.fields;
const validators = forms.validators;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createPosterForm = function(categories,tags){
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            validators:[validators.minlength(5)]
        }),
        'cost': fields.string({
            required: true,
            errorAfterField: true,
            validators:[validators.integer(),validators.min(0)]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            validators:[validators.minlength(5)]
        }),
        'category_id':fields.string({
            label:'Category',
            required:true,
            errorAfterField:true,
            choices:categories,
            widget:widgets.select()
        }),
        'tags':fields.string({
            required:true,
            errorAfterField:true,
            widget:widgets.multipleSelect(),
            choices:tags
        }),
        'image_url':fields.string({
            widget:widgets.hidden()
        })
    })
}

const createSearchForm = function (categories,tags){
    return forms.create({
        'name':fields.string({
            required:false,
            errorAfterField:true
        }),
        'min_cost':fields.number({
            required:false,
            errorAfterField:true,
            validators:[validators.integer()]
        }),
        'max_cost':fields.number({
            required:false,
            errorAfterField:true,
            validators:[validators.integer()]
        }),
        'category_id':fields.string({
            required: false,
            errorAfterField:true,
            choices:categories,
            widget:widgets.select()
        }),
        'tags':fields.string({
            required:false,
            errorAfterField:true,
            choices:tags,
            widget:widgets.multipleSelect()
        })
    })
}

const createUserForm = function(){
    return forms.create({
        'username':fields.string({
            required:true,
            errorAfterField:true
        }),
        'email':fields.string({
            required:true,
            errorAfterField:true,
        }),
        'password':fields.password({
            required:true,
            errorAfterField:true
        }),
        'confirm_password':fields.password({           
            required:true,
            errorAfterField:true,
            validators:[validators.matchField('password')]      
        })
    })
}

const createUserLogin = function (){
    return forms.create({
        email:fields.string({
            required:true,
            errorAfterField:true
        }),
        password:fields.password({
            required:true,
            errorAfterField:true
        })
    })
}

module.exports = {createPosterForm, createSearchForm, createUserForm, createUserLogin, bootstrapField}