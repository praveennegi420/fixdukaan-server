const authCheck = require('../middleware/authcheck')
const userSchema= require('../models/user')
const shopSchema= require('../models/shops')
const productSchema= require('../models/products')
const orderSchema= require('../models/orders')
const order = require('../models/orders')
const router= require('express').Router()


router.get('/user-orders', authCheck, async(req, res)=>{
    if(req.user.type!=='user') return res.status(400).send({status:'error', message: 'Invalid Access'});

    const orderData= req.user.orders.map(async(order)=>{
        const fullData= await shopSchema.findById(order.shop)
        .then(async(shop)=>{
            const prod= await productSchema.findById(order.product).then(product=>{ return product; })
            return [shop, prod];  
        }).catch(err=> res.send({status: 'error', message:'Something went wrong'}))
        fullData[0].product=""; fullData[1].shop="";
        return {shop: fullData[0], product: fullData[1], location: order.location, date: order.date, _id: order._id}
    }) 
    
    Promise.all(orderData)
    .then(data=> res.send({status:'success', data}))
    .catch(err=> res.send({status: 'error', message:'Something went wrong'}))  
})

router.get('/shop-orders', authCheck, async(req, res)=>{
    if(req.user.type!=='shop') return res.status(400).send({status:'error', message: 'Invalid Access'}); 
    
    const shopId= await shopSchema.findOne({user: req.user._id})
    .then(async(shopId)=>{
        await orderSchema.find({shop: shopId}).then(async (allOrders)=>{
            const orderData= allOrders.map(async(order)=>{
                const fullData= await productSchema.findById(order.product)
                .then(async(prod)=>{
                    const user= await userSchema.findById(order.user).then(user=>{ return user;})
                    return [prod, user];  
                }).catch(err=> res.send({status: 'error', message:'Something went wrong'}))
                fullData[0].shop=""; 
                fullData[1].orders= ""; fullData[1].password= ""; fullData[1].type= ""; fullData[1]._id= "";
                return {product: fullData[0], location: order.location, user: fullData[1], date: order.date, _id: order._id}
            }) 

            Promise.all(orderData)
            .then(data=> res.send({status:'success', data}))
            .catch(err=> res.send({status: 'error', message:'Something went wrong'})) 
        })
    }).catch(err=> res.send({status: "error", message: "Something went wrong"}))
}) 
  
router.get('/all-orders', authCheck, async(req, res)=>{
    if(req.user.type!=='admin') return res.status(400).send({status:'error', message: 'Invalid Access'});    
    const allOrders= await orderSchema.find({})

    const orderData= allOrders.map(async(order)=>{
        const fullData= await shopSchema.findById(order.shop)
        .then(async(shop)=>{
            const data= await productSchema.findById(order.product)
            .then(async(prod)=>{
                const data= await userSchema.findById(order.user).then((user)=> {return [prod, user]})
                return data;
           }) 
            return [shop, data];  
        }).catch(err=> res.send({status: 'error', message:'Something went wrong'})) 
        
        fullData[0].product=""; fullData[1][0].shop= ""; 
        if(fullData[1][1]){
            fullData[1][1].orders= ""; fullData[1][1].password= ""; fullData[1][1].type= ""; fullData[1][1]._id= "";
            return {shop: fullData[0], product: fullData[1][0], user: fullData[1][1], location: order.location, date: order.date, _id: order._id} 
        }
    })   
     
    Promise.all(orderData) 
    .then(data=> res.send({status:'success', data})) 
    .catch(err=> res.send({status: 'error', message:'Something went wrong'}))  
})

module.exports= router     