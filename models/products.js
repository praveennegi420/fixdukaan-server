const mongoose= require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId;
const productSchema= mongoose.Schema({
    name: {type: String, required: true},
    img:  {type: String, required: true},
    shop: {type: Array, default: []}
})

const product= mongoose.model('product', productSchema)
module.exports= product   