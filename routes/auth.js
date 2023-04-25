const router= require('express').Router()
const bcrypt= require('bcryptjs')

const userSchema= require('../models/user')
const authCheck = require('../middleware/authcheck')

router.post('/signup', async (req, res)=>{
    const user= await userSchema.findOne({email: req.body.email})
    if(user) return res.status(403).send({message: "User with given email already Exist!"})
    
    const salt= await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(req.body.password, salt);
    let newUser= await new userSchema({
        ...req.body, 
        password: hashPassword
    }).save();

    res.status(200).send({message: "Account Created Successfully."})
})

router.post('/login', async(req, res)=>{
    const user= await userSchema.findOne({email:req.body.email})
    if(!user) return res.status(403).send({message: "User doesn't exist, SignUp first!"})

    const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send({ message: "Invalid email or password!" });

    const token= user.generateAuthToken();
    res.status(200).send({data: token, message: "Login Successfull."})
})

router.get('/user-details', authCheck,async(req, res)=>{
    res.status(200).send({status: 'success', data: req.user})
})

module.exports= router 