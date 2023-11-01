const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

router.post('/signup',async (req, res)=>{
    const {email, password} = req.body;
    console.log(req.body);
    try{
        const user = new User({email, password});
        await user.save();

        const token = jwt.sign({userId:user._id}, 'MY_SECRET_KEY');

        res.send({token:token})

    }catch(error){
        return res.status(422).send(error.message);
    }
})

router.post('/signin', async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(422).send({error:'Provide email and password!'});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(404).send({error:'Email Not Found!'});
    }

    try{
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');
        res.send({token:token})
        
    }catch(error){
        return res.status(422).send({error:'Provide email and password!'});
    }
})

module.exports = router;