const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const cartsRouter = require('./routes/cart');
const OrderRouter = require('./routes/order');
const PaymentRouter = require('./routes/stripe');

dotenv.config();
const app = express();

app.use(cors)

mongoose.connect(process.env.MONGO_DB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then( () => {
    console.log("Connect DB");
}).catch( (e) => {
    console.log("Not Connecting To DB", e);
})

app.use(express.json());
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/orders", OrderRouter)
app.use("/api/checkout", PaymentRouter)

app.listen(process.env.PORT || 5000, () => {
    console.log("BackEnd server Running with port", process.env.PORT);
});
