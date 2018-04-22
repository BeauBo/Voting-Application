import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({ verbose: true})



const router = express.Router()


router.get('/auth/google', passport.authenticate('google',{
    scope: ['profile'],
    //session: false
}))


router.get('/auth/google/redirect', passport.authenticate('google', {session: false}), (req, res, next) => {
    const googleToken = jwt.sign({
        _id: req.user._id,
        name: req.user.username,
        id: req.user.googleID,
        picture: req.user.picture
    }, process.env.secret, {expiresIn: 3600})
    res.redirect(`/?googleToken=${googleToken}`)
    
})




export default router