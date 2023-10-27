require('./models/User');
require('./models/Track');
const express = require('express');
const app=express();
const mongoose = require('mongoose')
const bodyParse = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireauth = require('./middlewares/requireAuth');

app.use(bodyParse.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUrl = 'mongodb+srv://yunlongaliu:ZWEFJgDPBB303Ocx@cluster0.8ybwnzc.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoUrl)
mongoose.connection.on('connected',()=>{
    console.log('connection ok');
})

mongoose.connection.on('error',(err)=>{
    console.log('connection is not ok');
})


app.get('/',requireauth, (req, res)=>{
    res.send(`You email is ${req.user.email}`)
});

app.listen(3000,()=>{
    console.log('I am listing on 3000');
})