const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    user : { 
        type : String,
        trim : true,
        unique : 'Username already exists',
        required : 'Username is required'
    },
    email :{ 
        type : String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Email is invalid'],
        required: 'Email is required'
    },
    hashed_password : { 
        type : String,
        required: "Password is required",
    }
})

UserSchema.path('hashed_password').validate(function(pass){
    if(this._password && this._password.length < 8){
        this.invalidate('password', 'Password must be at least 8 characters.')
    }
    if(!this._password && this.isNew){
        this.invalidate('password', 'Password is required.')
    }
},null)

UserSchema.virtual('password')
.set(function(pass){
    this._password = pass
    this.hashed_password = this.encryptPassword(pass)
})
.get(function(){
    return this._password
})

UserSchema.methods = {
    authenticate : function(pass){
        return bcrypt.compareSync(pass, this.hashed_password)
    },
    encryptPassword : function(pass){
        return bcrypt.hashSync(pass, 12)
    }
}

module.exports = mongoose.model('User',UserSchema)