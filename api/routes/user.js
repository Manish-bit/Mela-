const express = require('express')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin }= require('./verifyToken')
const UserModel = require('../models/User')
const CryptoJS = require('crypto-js')

const router = express.Router();

//updating a user

router.put("/:id",verifyTokenAndAuthorization, async(req,res)=>{
   if(req.body.password){
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
   }
   try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,{
        $set:req.body
    },{new:true})
    res.status(200).json(updatedUser)
   } catch (error) {
        res.status(500).json(error)
   }
})


//delete a user 

router.delete('/:id', verifyTokenAndAuthorization, async(req,res)=>{
    try {
        await UserModel.findByIdAndDelete(req.params.id)
        res.status(200).json("Deleted sucessfully")
        
    } catch (error) {
        res.status(500).json(error)
    }
})



//find a user
router.get('/find/:id', verifyTokenAndAdmin, async(req,res)=>{
    try {
        const user = await UserModel.findById(req.params.id)
        const {password, ...info}= user._doc;
        res.status(200).json(info)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

//get all user

router.get('/', verifyTokenAndAdmin, async(req,res)=>{
    try {
        const users = await UserModel.find()
        res.status(200).json(users)
        
    } catch (error) {
        res.status(500).json(error)
    }
})



//get user stats 
router.get('/stats', verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
    try {
        const data = await UserModel.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},
            {
                $project:{
                    month:{$month:"$createdAt"}
                },
            },
            {$group:{
                _id:"$month",
                total:{$sum:1}
            }},
        ]) 

        res.status(200).json(data)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;


