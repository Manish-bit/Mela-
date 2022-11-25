const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')


dotenv.config();
const app = express();



//middlewares
app.use(express.json())


//mongodb connection string
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(()=>console.log("Mongodb connected successfully"))
.catch((err)=>{
    console.log(err)
})




//routes for api endpoint
app.use("/api/auth",authRoute)
app.use("/api/users", userRoute)
app.use("/api/products",productRoute)
app.use("/api/carts",cartRoute)
app.use("/api/orders",orderRoute)







app.listen(5000, ()=>{
    console.log(`Server is running in port 5000` )
});