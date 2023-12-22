const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    productsName:{
        type:String,
        
    }
},
{timestamps:true}
)

module.exports = mongoose.model("add-products",ProductSchema)