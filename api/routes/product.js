const express = require('express')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin }= require('./verifyToken')
const ProductModel = require('../models/Product')
const CryptoJS = require('crypto-js')

const router = express.Router();

//adding a product 

router.post("/",verifyTokenAndAdmin, async(req,res)=>{
   const newProduct = new ProductModel(req.body)

   try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct)
    
   } catch (error) {
    res.status(500).json(error)
   }
})


//updating a product 

router.put("/:id", verifyTokenAndAdmin, async(req,res)=>{
    try {
        const updatedProducts = await ProductModel.findByIdAndUpdate
        (req.params.id,
            {$set:req.body} , {new:true})
            res.status(200).json(updatedProducts)
    } catch (error) {
        res.status(500).json(error)
    }
})


//delete a product

router.delete("/:id",verifyTokenAndAdmin, async(req,res)=>{
    try {
        await ProductModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted Sucessfully");
        
    } catch (error) {
        res.status(500).json(error)
    }
})



 //get a  product

 router.get("/find/:id", async(req,res)=>{
    try {
        const product = await ProductModel.findById(req.params.id);
        res.status(200).json(product);
        
    } catch (error) {
        res.status(500).json(error)
    }
 })


//get all products

router.get("/", async(req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if(qNew)
        {
            products =  await ProductModel.find().sort({createdAt: -1}).limit()
        }else if(qCategory){
            products = await ProductModel.find({
                categories:{
                    $in:[qCategory]
                }
            })
        }else{
            products = await ProductModel.find();
        }
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;


