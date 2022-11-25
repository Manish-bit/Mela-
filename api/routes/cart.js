const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require('./verifyToken');

const router = require('express').Router();
const CartModel = require('../models/Cart')


//create a cart 

router.post("/",verifyToken, async(req,res)=>{

    const newCart = new CartModel(req.body)

    try { 
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
        
    } catch (error) {
        res.status(500).json(error)
    }


})


//update a cart

router.put("/:id", verifyTokenAndAuthorization, async(req,res)=>{
    try {
        const updatedProduct = await CartModel.findByIdAndUpdate(req.params.id,
            {$set:req.body}, 
            {new:true})
        res.status(200).json(updatedProduct)

    } catch (error) {
        res.status(500).json(error)
    }
})


//delete a cart 

router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try {
        await CartModel.findByIdAndDelete(req.params.id)
        res.status(200).json("Deleted sucessfully")
    } catch (error) {
        res.status(500).json(error)
    }
})


// get user Cart

router.get("/find/:id", verifyTokenAndAuthorization, async(req,res)=>{
    const cart = await CartModel.findOne({userId: req.params.id});
    res.status(200).json(cart)
})


//get all cart 

router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    try {
        const products = await CartModel.find();
        res.status(200).json(products)
        
    } catch (error) {
        res.status(500).json(error)
    }
})



module.exports = router