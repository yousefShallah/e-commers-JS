const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken');


// Register....
router.post("/register", async (req, res) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try {
        const user_name = await User.findOne({username: req.body.username})
        const user_email = await User.findOne({email: req.body.email})
        if(user_name === null && user_email === null){
            const savedUser = await newUser.save()
            return res.status(200).json(savedUser)
        }else{
            return res.status(500).json("User is already exist...!")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

// login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
        if(!user){
            return res.status(401).json("User is not exist!")
        }
        
        const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
        const originalPassword = hashPassword.toString(CryptoJS.enc.Utf8);
        if(originalPassword != req.body.password){
            return res.status(401).json("Wronge Password")
        } 

        // access token 
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC,
        {expiresIn: "3d"})
        const { password, ...others } = user._doc;
        const resData = { ...others, token: accessToken }
        return res.status(200).json(resData);
    } catch (error) {
        return res.status(500).json(error)
    }
})

module.exports = router