const { error } = require('console')
const User = require('../modal/authmodal.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sign } = require('crypto')

const registerUser = async (req, res) => {
    const {username, email, password} = req.body

    if(!username || !email) {
       return res.status(404).json({message:'an error occured'})
    }

    if(password.length < 8) {
        return res.status(400).json({message:'password is less than 8'})

    } 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    
        try {
           const existEmail = await User.findOne({email}) 
            if (existEmail){
                res.status(400).json({message:"email already exisist"})
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser =  new User({username, email, password:hashedPassword})
            await newUser.save()
            res.status(201).json({message:"user created successfully "})

        }catch(error){
            console.error("Error registering user:", error)
            res.status(500).json({error:'An error occured while register the user'})
        }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({message:'invalid email or password'})
    } 

    try{
        const user = await User.findOne({email})
        if (!user) {
            res.status(400).json({message:'user does not exist'})
        }

        const isPassword = await bcrypt.compare(password, user.password)

        if(!isPassword){
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({userId:user._id}, 'secretKey')
        res.status(200).json({message:'login succes', Token:token})

    }catch(error){
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'An error occurred while logging in'})
    }

}
module.exports={
    registerUser,
    loginUser
}