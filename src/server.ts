import express from 'express'
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import connectDB from './config/db'
import cors from 'cors'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import userRouter from './routes/userRoute'
import resortAdminRouter from './routes/resortAdminRoute'
import adminRouter from './routes/adminRoutes'
import userRepository from './repositories/userRepository'
import { generateAccessToken, generateRefreshToken } from './utils/jwtHelper'
import { app, server } from './socket/socket'

dotenv.config()
connectDB()

const port = process.env.PORT || 5000


app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: "GET, POST, PUT, DELETE, PATCH",
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            let user = await userRepository.findByEmail(profile.emails![0].value)
            
            if (!user) {
                user = await userRepository.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails![0].value,
                    avatar: profile.photos![0].value,
                    role: 'user',
                })
            }
            const accessToken = generateAccessToken({id: user._id as string, role: user.role})
            const refreshToken = generateRefreshToken(user._id as string)
            cb(null, { accessToken, refreshToken });
        } catch (error) {
            cb(error, false)
        }
    }
))

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect:'/signin' }),
    (req:any, res) => {
        res.cookie('userAccessT', req.user.accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000, sameSite: 'none', secure: process.env.NODE_ENV !== 'development' });
        res.cookie('userRefreshT', req.user.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: process.env.NODE_ENV !== 'development' });
        
        res.redirect(`${process.env.FRONTEND_URL}`)
    }
)


app.use('/api/user', userRouter)
app.use('/api/resort', resortAdminRouter)
app.use('/api/admin', adminRouter)


server.listen(port, () => {
    console.log(`Server started at : ${port}`)
})