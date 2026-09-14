require("dotenv").config()
const jwt = require("jsonwebtoken")
const express = require("express")
const { connectDB } = require("./db")
const Analytic = require("./model/user.model")
const PORT = process.env.PORT || 8001
const MONGO_URL = process.env.MONGO_URL || 8001
const app = express()

const userRouter = require("./routes/user.route")
const User = require("./model/user.model")
// middleware
const refresh_secret = process.env.REFRESH_SECRET_KEY
const access_secret = process.env.ACCESS_SECRET_KEY
app.use(express.json())

// routes
app.use("/user", userRouter)
app.post("/refreshToken", async(req,res)=>{
    try {
        const { refreshToken } = req.body
        if(!refreshToken) {
            return res.status(400).send("refresh token is missing")
        }
        const {email} = jwt.verify(refreshToken, refresh_secret)
        const user = await User.findOne({email })
        const accessToken = jwt.sign({ email }, access_secret, { expiresIn : "1m"})

        // we should update the refreshToken after this request for security reason
        if(user){
            return res.status(200).send({ accessToken: accessToken })
        }
    } catch (error) {
        res.status(500).send("refresh token is not valid or expired")
    }
    
   
})

app.get("/ref")

// storing userID logged data to check each user can make 5 requests per minute



connectDB(MONGO_URL)

app.listen(PORT , ()=>{
    console.log("server started on the port number : ", PORT);
    
})