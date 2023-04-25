const mongoose = require("mongoose");
const jwt= require('jsonwebtoken')

const userSchema= new mongoose.Schema({
    name:  {type: String, required:true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    type: {type:String, required: true}, 
    orders: {type: Array, default: []}
})

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, name: this.name, isAdmin: this.isAdmin },
		process.env.JWTPRIVATEKEY,
		{ expiresIn: "7d" }
	);
	return token; 
};

const User= mongoose.model('user', userSchema);
module.exports= User

  