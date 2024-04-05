const { error } = require('console')
const User = require('../modal/authmodal.js')
const bcrypt = require('bcrypt')

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
module.exports={
    registerUser
}