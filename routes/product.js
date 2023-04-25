const router= require('express').Router()
const authCheck= require('../middleware/authcheck')
const shopSchema= require('../models/shops')
const productSchema= require('../models/products')

router.get('/', async(req, res)=>{
    const products= await productSchema.find({});
    res.status(200).send({data: products})
})

router.get('/get-shops', async(req,res)=>{
    const product= await productSchema.findById(req.query.id)
    res.status(200).send({data: product.shop})
})

router.post('/add-product', authCheck, async(req,res)=>{
    if(req.user.type!=='admin') return res.status(500).send({status: 'error', message: 'Invalid Access'});
    
    const addProduct= await new productSchema({...req.body}).save()
    res.send({status:"success", message: 'Product Added.'})
})

module.exports= router  