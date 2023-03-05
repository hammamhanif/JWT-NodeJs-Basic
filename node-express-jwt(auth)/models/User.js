const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: [true,'Please Enter an email'],
        unique: true,
        lowercase: true,
        validate:[isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum Password length is 6 characters']
    },
});


// Fire a function before doc saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password= await bcrypt.hash(this.password,salt);
    next();
});

// Static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
      throw Error('incorrect email');
    }
   
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      throw Error('incorrect password');
    }
   
    return user;
  }


const User = mongoose.model('user', userSchema);

module.exports = User;