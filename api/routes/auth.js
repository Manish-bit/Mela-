const router = require('express').Router();
const UserModel= require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')




//Register a user

router.post("/register", async(req,res)=>{
    const newUser = new UserModel({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    })
    try {
        await newUser.save();
        res.status(200).json(newUser)
        
    } catch (error) {
        res.status(500).json(error)
    }
})


//Login a user

router.post("/login", async(req,res)=>{
    try {
        const user = await UserModel.findOne({username:req.body.username});
        if(!user){
         return res.status(400).json("Wrong credentials")
        }  

        const hashedPassword= CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const password = hashedPassword.toString(CryptoJS.enc.Utf8);

        if(password !== req.body.password)
        {
          return res.status(400).json("Wrong credentials")
        }
        else{
        
        //generating a jsonwebtoken
        const  accessToken = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.PASS_SEC,{expiresIn:"3d"}) 
        const { password, ...others }= user._doc;
        return res.status(200).json({...others,accessToken});
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;