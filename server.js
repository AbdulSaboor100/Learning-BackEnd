import express from "express";
import env from 'dotenv';
import connect from './config/db.js';
import auth from './routes/api/auth.js';
import posts from './routes/api/posts.js';
import profile from './routes/api/profile.js';
import user from './routes/api/user.js';


let app = express();
env.config()
let PORT = process.env.PORT
connect()
app.use(express.json({extented : true}))
app.get('/',(req,res)=>{
    res.send("home route")
})

app.use('/api/auth',auth)
app.use('/api/posts',posts)
app.use('/api/profile',profile)
app.use('/api/user',user)


app.listen((PORT),()=>{
    console.log(`Server running at port ${PORT}`)
})