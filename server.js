express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./router/router.js')

const url = "mongodb+srv://yahyatijjani99:4TkxTOuCvo8D4W5i@authsystem.d1fbmis.mongodb.net/?retryWrites=true&w=majority&appName=Authsystem"


app = express()
app.use(express.json())

app.use('/auth/api', authRouter)

app.get('/home', (req, res)=> {
    res.send('helo')
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

