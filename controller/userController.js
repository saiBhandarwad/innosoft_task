const User = require("../model/user.model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const { generateRefreshToken, generateAccessToken } = require("../utils/token");
const refresh_secret = process.env.REFRESH_SECRET_KEY
const access_secret = process.env.ACCESS_SECRET_KEY
const createUser = async (req, res) => {

    try {
        const { name, email, password } = req.body
        console.log({ name, email, password });
        const hashedPassword = await bcrypt.hash(password, 10)
        const refreshToken = jwt.sign({ email }, refresh_secret, { expiresIn: "7d" })
        const accessToken = jwt.sign({ email }, access_secret, { expiresIn: "1m" })
        const isEmailExists = await User.findOne({ email })
        if (isEmailExists) {
            return res.status(400).send("Email Already present ")
        }

        const user = await User.create({
            name, email, password: hashedPassword, refreshToken
        })
        return res.status(201).send({ user, refreshToken, accessToken })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).send("invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user?.password)
        if (!isPasswordValid) {
            return res.status(401).send("invalid credentials")
        }
        const accessToken = jwt.sign({ email }, access_secret, { expiresIn: "1m" })
        return res.status(200).send({ accessToken })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
module.exports = { createUser, loginUser }