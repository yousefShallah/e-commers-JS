const Cart = require('../models/Cart');
const { virifyTokenAndAuth, virifyTokenAndAdmin, verifyToken } = require('./verifyToken');
const router = require('express').Router();

// create  
router.post("/add", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const cart = await newCart.save();
        res.status(200).json(cart)
    } catch (err) {
        res.status(500).json(`Error: ${err}`)
    }
})



// update 
router.put("/:id", virifyTokenAndAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});
        res.status(200).json(updatedCart)
    } catch (err) {
        res.status(500).json(`Error: ${err}`)
    }
})

// delete 
router.delete("/delete/:id", virifyTokenAndAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted!")
    } catch (err) {
        res.status(500).json(`Error: ${err}`)
    }
})

// get user cart 
router.get("/find/:userId", virifyTokenAndAuth, async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.params.userId })
        // const { ...others } = cart._doc;
        res.status(200).json(cart)
    } catch (err) {
        res.status(500).json(`Error: ${err}`)
    }
})

// get all 
router.get("/", virifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(`Error: ${err}`)
    }
})

module.exports = router