const router = require('express').Router()
const authCheck = require('../middleware/authcheck')
const shopSchema = require('../models/shops')
const productSchema = require('../models/products')
const orderSchema = require('../models/orders')
const userSchema = require('../models/user')

router.get('/get-shop', async (req, res) => {
    if (!req.query.id) res.status(400).send({ message: "Shop Id required" })
    console.log(req.query.id)
    const shopDetails = await shopSchema.findById(req.query.id); 
    shopDetails.order= "No Data NO Data"
    res.status(200).send({ data: shopDetails })
})

router.get('/all-shops', async (req, res) => {
    const allShops = await shopSchema.find({})
    const shopData= allShops.map(shop=> { shop.order=""; return shop; })
    res.status(200).send({ data: shopData })
})

router.post('/place-order', authCheck, async (req, res) => {
    
    const date = new Date()
    const shop = await shopSchema.findById(req.body.shopId)
    .then(async(shop)=> await productSchema.findById(req.body.productId)
        .then(async (product) => { await new orderSchema({ user: req.user._id, shop, date, product, location: req.body.location }).save()
            .then(async(order)=>{ 
                req.user.orders.push(order);
                await userSchema.updateOne({_id: req.user._id}, {orders: req.user.orders})
                .then(async(updatedUser)=>{  
                    res.send({status:'success', message:'Order Placed', data:order})
                }) 
            })
    }))
    .catch(err => res.send({status:'error', message: 'Something went wrong'}))
})


router.post('/add-shop', authCheck, async (req, res) => {
    if (req.user.type === 'user') return res.status(500).send({ status: 'error', message: 'Invalid Access' });

    const products = await req.body.product.map(async (name) => {
        let prodCheck = await productSchema.find({ name })
        if (prodCheck.length === 0) {
            const newProduct = await new productSchema({ name, img: 'default' }).save()
            prodCheck = await productSchema.find({ name })
            return prodCheck[0];
        }
        else return prodCheck[0];
    })

    Promise.all(products).then(async (data) => {
        req.body.product = data
        let addShop
        if(req.user.type==='shop') addShop  = await new shopSchema({ ...req.body, user: req.user }).save()
        else addShop  = await new shopSchema({ ...req.body }).save()
        data.map(async (id) => {
            const updateProd = await productSchema.findById(id);
            updateProd.shop.push(addShop)
            const product = await productSchema.updateOne({ _id: id }, { shop: updateProd.shop });
        })
    }).catch(err => console.log(err))

    res.send({ status: "success", message: 'Shop Added.' })
})

module.exports = router 