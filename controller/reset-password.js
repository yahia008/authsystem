const User = require('../modal/authmodal.js')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:"Gmail",
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:"yahyatijjani99@gmail.com",
        pass:"ikvngopfpeunejca"
    }
})

const forgotUser = async (req, res) => {

    const {email} = req.body

    if (!email){
        return res.status(400).json({message:'email is required'})
    }
 try {
    const userEmail = await User.findOne({email})

    if (!userEmail){
        return res.status(400).json({message:'email is required'})
    }
    resetToken = crypto.randomBytes(20).toString('hex')
    userEmail.resetToken = resetToken
    userEmail.tokenExp = Date.now() + 3600000
    userEmail.save()

    
    const mailOptions = {
        from: "yahyatijjani99@gmail.com",
        to:userEmail.email,
        subject: resetToken,
        text:`You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
        } else {
          console.log("Email sent: ", info.response);
        }
      });

    return res.status(200).json({message:'reset token sent'})
}catch(error){
    console.error('Error generating reset token:', error);
    res.status(500).json({ error: 'An error occurred while generating the reset token' });
  
}
}

const resetUser = async (req, res) => {
    const  {newPassword, resetToken} = req.body

    if (!newPassword || resetToken){
        return res.status(400).json({message:'invalid email or token'})

    }
    try{
        const user = await User.findOne({resetToken,
        tokenExp:{$gt:Date.now()}})

        if(!user){
            return res.status(400).json({message:'invalid user'})
        }

        const salt = bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword
        user.resetToken = undefined;
        user.tokenExp = undefined;
        await user.save();
        res.status(200).json({ message: 'Password reset successful' });

    }catch(error){
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'An error occurred while resetting the password' });
    }

}

module.exports = {
    forgotUser,
    resetUser
}