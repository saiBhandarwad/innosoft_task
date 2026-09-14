const refresh_secret = process.env.REFRESH_SECRET_KEY
const access_secret = process.env.ACCESS_SECRET_KEY
const jwt = require("jsonwebtoken")

const generateAccessToken = async (data) => {
    return jwt.sign(data, access_secret, { expiresIn: "7d" })
}
const generateRefreshToken = async (data) => {
    return jwt.sign(data, refresh_secret, { expiresIn: "7d" })
}

module.exports = {generateAccessToken, generateRefreshToken}