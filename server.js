express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./router/router.js')
const {authUser} = require('./middleware/authmiddleware.js')

const url = "mongodb+srv://yahyatijjani99:4TkxTOuCvo8D4W5i@authsystem.d1fbmis.mongodb.net/?retryWrites=true&w=majority&appName=Authsystem"


app = express()
app.use(express.json())

app.use('/auth/api', authRouter)

app.get('/home', authUser, (req, res)=> {
    
    res.status(200).json({message:'you are authenticated'})
})




mongoose.connect(url)
.then(()=> {
    console.log("connected to a database")
    app.listen(3000, ()=>{
        console.log('server runing at port 3000')
    })

}).catch((error)=> {
    console.log("connection failed:", error)
})

