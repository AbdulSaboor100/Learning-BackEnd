import express from "express";
import passport from '../../middlewares/passport.js'
import User from "../../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import { check, validationResult } from "express-validator";

let router = express.Router();
env.config()

router.get('/user', passport, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(400).send("Server error")
    }
})

router.post('/login', [check("email", "Please include a valid email").isEmail(), check("password", "Please enter a password with 6 or more characters").exists()], async (req, res) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        let { email, password } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            res.status(400).json([{ errors: { message: "Invalid Credentials" } }])
        } else {
            let isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                res.status(400).json([{ errors: { message: "Invalid Credentials" } }])
            } else {
                let payload = {
                    user: {
                        id: user.id
                    }
                }
                jwt.sign(payload, process.env.jwtSecurity, { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err
                    res.json({ token })
                })
            }
        }
    } catch (error) {
        console.log(error.message)
        res.status(400).send("Server error")
    }
})

export default router;