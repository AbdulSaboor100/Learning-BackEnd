import jwt from 'jsonwebtoken';
import env from 'dotenv';

export default function (req, res, next) {
    env.config()
    let token = req.header("Authorization");
    if (!token) {
        res.status(401).json({ msg: "No token ! Authorization Denied" })
    } else {
        try {
            let decodedInfo = jwt.verify(token, process.env.jwtSecurity)
            req.user = decodedInfo.user
            next()
        } catch (error) {
            res.status(401).json({msg : "Token is invalid"})
        }
    }
}