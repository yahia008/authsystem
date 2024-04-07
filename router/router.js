const express = require('express')
const {registerUser, loginUser} = require('../controller/auth.controller.js');
const {forgotUser, resetUser } = require('../controller/reset-password.js')



 const router = express.Router()

 router.post('/register', registerUser)
 router.post('/login', loginUser)
 router.post('forgotUser', forgotUser)
 router.post('/resetUser', resetUser)



 module.exports = router