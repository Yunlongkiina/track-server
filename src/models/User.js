const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { reject } = require('bcrypt/promises');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    },

})

// check before hash
// here we use function keyword, to avoid this key>>>>>>>>>
userSchema.pre('save', function (next) {
    const user = this;
    // if user is not modify password, continue
    if(!user.isModified('password')){
        return next();
    }
    //else, add salt and hash password

    bcrypt.genSalt(10, (err, salt)=>{
        if(err){
            return next(err);
        }

        bcrypt.hash(user.password, salt,(err, hash)=>{
            if(err){
                return next(err);
            }


            user.password = hash;
            next();
        })
    })
})


// check user password and password in DB
// candidatePassword: password user input
//user.password: hashed password in DB
userSchema.methods.comparePassword = function(candidatePassword){
    const user = this;

    // we want it excute in async, thats we  return promise here
    return new Promise((resolve, reject)=>{
        // isMatch:  candidatePassword === user.password or not
        bcrypt.compare(candidatePassword, user.password, (err, isMatch)=>{
            if(err){
                return reject(err);
            }

            if(!isMatch){
                return reject(false)
            }

            resolve(true)
        })
    })
}
mongoose.model('User', userSchema);