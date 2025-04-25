const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CategorySchema= new Schema({
    title: {
        type: String,
        required: true
    },
    description: String 
});

const Category = mongoose.model('Categoty', CategorySchema)
module.exports= Category 