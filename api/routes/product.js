const Product = require('../models/Product');
const { virifyTokenAndAuth, virifyTokenAndAdmin } = require('./verifyToken');
const router = require('express').Router();

// create Product 

router.post("/create", virifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const product = await newProduct.save();
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json(`Error: ${err}`)
    }
})



// update product
router.put("/:id", virifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});
        res.status(200).json(updatedProduct)
    } catch (err) {
        res.status(500).json(`Error: ${err}`)
    }
})

// delete product
router.delete("/delete/:id", virifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted!")
    } catch (err) {
        res.status(500).json(`Error: ${err}`)
    }
})

// get one product with id 
router.get("/find/:id", virifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        const { ...others } = product._doc;
        res.status(200).json(others)
    } catch (err) {
        res.status(500).json(`Error: ${err}`)
    }
})

// get all products 
router.get("/", virifyTokenAndAdmin, async (req, res) => {
    const qnew = req.query.new
    const qCategory = req.query.category
    try {
        let products = [];
        if(qnew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        }else if (qCategory){
            products = await Product.find({categories: {
                $in: [qCategory],
            }}).sort().limit(5)
        }else{
            products = await Product.find();
        }
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(`Error: ${err}`)
    }
})

module.exports = router