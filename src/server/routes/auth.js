import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'






const router = express.Router()


router.get('https://voteplex-voting.herokuapp.com/auth/google', passport.authenticate('google',{
    scope: ['profile'],
    //session: false
}))


router.get('https://voteplex-voting.herokuapp.com/auth/google/redirect', passport.authenticate('google', {session: false}), (req, res, next) => {
    const googleToken = jwt.sign({
        _id: req.user._id,
        name: req.user.username,
        id: req.user.googleID,
        picture: req.user.picture
    }, process.env.secret, {expiresIn: 3600})
    res.redirect(`https://voteplex-voting.herokuapp.com/?googleToken=${googleToken}`)
    
})




export default router
