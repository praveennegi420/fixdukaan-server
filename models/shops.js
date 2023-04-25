const mongoose= require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId;
const shopSchema= mongoose.Schema({
    shopname:{ type: String, required: true },
    img: { type: String, required: true },
    price: { type: String, required: true },
    shopkeeperName: {type: String, required: true},
    phone: {type: String, required: true},
    user: {type: ObjectId},
    product: {type: [ObjectId], default:[]}
})

const shop= mongoose.model('shop', shopSchema);
module.exports= shop 