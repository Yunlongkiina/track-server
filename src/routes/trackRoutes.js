const express = require('express')
const mongoose = require('mongoose')

const requireAuth = require('../middlewares/requireAuth')
// can't directly inport Track, otherwise mongoose will raise error"" you cant create Track model multi times"
const Track = mongoose.model('Track')

const router = express.Router();
// make sure all user signed in before goto next step
router.use(requireAuth);

router.get('/tracks',async (req, res)=>{
    const tracks = await Track.find({userId:req.user._id})
    res.send(tracks);
})

router.post('/tracks',async (req, res)=>{
    const {name, locations} = req.body;
    console.log({name, locations} );
    if(!name || !locations){
        return res.status(422).send({error:'You must provide name and locations'})
    }
    try{
        const track = new Track({name, locations, userId: req.user._id})
        await track.save();    
    }catch(err){
        res.status(422).send({error: err.message})
    }
})


module.exports = router;