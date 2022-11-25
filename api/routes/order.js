const router = require('express').Router();
const OrderModel = require('../models/Order');
const { verifyTokenAndAuthorization, verifyToken, verifyTokenAndAdmin } = require('./verifyToken');


//create a order 

router.post("/", verifyToken, async(req,res)=>{
    const newOrder = new OrderModel(req.body)
    try {
       const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
        
    } catch (error) {
        res.status(500).json(error)
    }
})


//update a order

router.put("/:id", verifyTokenAndAdmin, async(req,res)=>{
        try {
            const updatedProduct = await OrderModel.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
            res.status(200).json(updatedProduct)
            
        } catch (error) {
            res.status(500).json(error)
        }
})


//delete a order

router.delete("/:id", verifyTokenAndAdmin, async(req,res)=>{
    try {
        await OrderModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted sucessfully")
        
    } catch (error) {
        res.status(500).json(error)
    }
})


//get user orders

router.get("/find/:id", verifyTokenAndAdmin, async(req,res)=>{
    try {
        const order = await OrderModel.find({userId:req.params.id});
        res.status(200).json(order)
        
    } catch (error) {
        res.status(500).json(error)
    }

})


//get all orders

router.get("/",verifyTokenAndAdmin, async(req,res)=>{
    try {
        const orders = await OrderModel.find();
        res.status(200).json(orders)
        
    } catch (error) {
        res.status(500).json(error)
    }
})


//get monthly income

router.get("/income", verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-1))

    try {
    const income = await OrderModel.aggregate([
        {$match:{createdAt:{$gte:previousMonth}}},
        {
        $project:{
            month:{$month:"$createdAt"},
            sales:"$amount"
        }},
        {
            $group:{
                _id:"$month",
                total:{$sum:"$sales"}
            }
        }
    ])

    res.status(200).json(income)

    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router;
