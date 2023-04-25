require('dotenv').config()
const express= require('express')
const cors= require('cors')
const authRoutes= require('./routes/auth')
const productRoutes= require('./routes/product')
const orderRoutes= require('./routes/order')
const shopRoutes= require('./routes/shop')
const connectdb= require('./db')
const app= express()

const PORT= process.env.PORT || 5000

connectdb()
app.use(cors()) 
app.use(express.json())


app.use('/api/auth/', authRoutes);
app.use('/api/product/', productRoutes);
app.use('/api/shop/', shopRoutes);
app.use('/api/order/', orderRoutes);

app.listen(PORT, ()=>{console.log(`LISTENING AT PORT ${PORT}`)})

