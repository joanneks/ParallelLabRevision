'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  // first arg: the table that I want to change (ie add a new column to)
  // second arg: the name of the new column
  // THE NAME OF THE FK SHOULD BE THAT THE OTHER TABLE
  // IN SINGULAR FORM WIHT _ID at the back
  // third arg: the object that defines the column
  return db.addColumn('products',  'category_id', {
    type:'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'product_category_fk',
      table: 'categories',
      mapping:'id',
      rules: {
        'onDelete': 'cascade', // enables cascading delete
        'onUpdate': 'restrict'
      }
    
    }
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
