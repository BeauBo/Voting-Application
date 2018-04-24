import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import express from 'express'
import GoogleUser from './models/googleUser'


import dotenv from 'dotenv'

dotenv.config({ verbose: true})


passport.use(
    new GoogleStrategy({
        //options for the strategy
        callbackURL: process.env.googleCallBackURL,
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret
    }, (accessToken, refreshToken, profile, done) => {
        GoogleUser.findOne({googleID: profile.id}).then((currentUser) => {
            if(currentUser){
              
                    return done(null, currentUser)
        
                   
            }else{
                new GoogleUser(
                    {
                        googleID: profile.id,
                        username: profile.displayName,
                        picture: profile._json.image.url,

                    }
                ).save().then((newUser) => {
                    return done(null, newUser)
                })
            }
        })
    })
)



