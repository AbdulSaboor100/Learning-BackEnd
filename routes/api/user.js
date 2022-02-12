import express from "express";
import { check, validationResult } from "express-validator";
import User from '../../models/User.js'
import gravator from 'gravatar';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

let router = express.Router();
env.config()

async function passwordHashed(plainPassword) {
    let salt = 10;
    return await bcrypt.hash(plainPassword, salt)
}

router.post('/', [check("name", "Name is required").not().isEmpty(), check("email", "Please include a valid email").isEmail(), check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 })], async (req, res) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {    
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        let { name, email, password } = req.body
        let user = await User.findOne({ email })
        if (user) {
            res.status(400).json([{ errors: { message: "Email is already been used" } }])
        } else {
            let avator = gravator.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            user = new User({
                name,
                avator,
                email,
                password: await passwordHashed(password)
            })
            user.save()

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
    } catch (error) {
        console.log(error.message)
        res.status(400).send("Server error")
    }
})

export default router;