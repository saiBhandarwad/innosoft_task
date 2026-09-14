const mongoose = require("mongoose")

const connectDB = async (url) =>{
    try {
        const response = await mongoose.connect(url)
        console.log("database connection successful")
        
    } catch (error) {
        console.log("database connection error", error.message);
        
    }
}


module.exports = {connectDB}