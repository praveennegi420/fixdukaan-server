const mongoose= require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId;
const orderSchema= mongoose.Schema({
    user: {type: ObjectId, ref: "user", required: true},
    shop: {type: ObjectId, required: true},
    product: {type: ObjectId, required: true},
    date: {type: Date, required: true},
    location: {type: String, required: true}
}) 

const order= mongoose.model('order', orderSchema)
module.exports= order