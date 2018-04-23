import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import express from 'express'
import App from '../../shared/App'
import serialize from 'serialize-javascript'
import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import LocalPolls from '../models/polls-local'
import GooglePolls from '../models/polls-google'




//

const router = express.Router({caseSensitive: true})

// server rendering html file
router.get('*', (req, res, next) => {
    const name = 'Tyler'
    const markup = renderToString (
        <StaticRouter location={req.url} context={{}}>
            <App />
        </StaticRouter>  
    )

    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Voting Plex</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
                <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossorigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>
                <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js" defer></script>
                <script src="https://use.fontawesome.com/b2bddaf3ba.js"></script>
                <script type="text/javascript" src='/bundle.js' defer></script>
                <script>window.__INITIAL_DATA__=${serialize(name)}</script>
            </head>
        <body>
            <div id='app' class='container-fluid'>${markup}</div>
        </body>
        </html>
    `)
})



router.post('https://voteplex-voting.herokuapp.com/api/signup', (req, res, next) => {
    const {username, email, password } = req.body
    
    const user = {
        username,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }
    User.create(user).then((payload) => {
        const token = jwt.sign({ payload }, process.env.secret, {expiresIn: 3600})
            res.json({
                success: true,
                error: null,
                token
            })
    }, (err) => {
        if(err.name === 'BulkWriteError' && err.code === 11000){
            res.json({
                success: false,
                error: 'User already exist!',
                token: null
            })
        }
    })
    
})

router.post('https://voteplex-voting.herokuapp.com/api/login', (req, res, next) => {
    const { email, password } = req.body
    
    User.findOne({email: email}).then((payload) => {
        if(payload === null){
            res.json({
                success: false,
                error: 'Email or password incorrect!',
                token: null
            })
        }else {
                if(payload.email === email && bcrypt.compareSync(password, payload.password)){
                    const token = jwt.sign({payload}, process.env.secret, { expiresIn: 36000})
                    res.json({
                        success: true,
                        error: null,
                        token
                    })
                }else{
                    res.json({
                        success: false,
                        error: 'Email or password incorrect!',
                        token: null
                    })
                }
            } 
    }, (err) => {
        res.json({
            success: false,
            error: err,
            token: null
        })
    })
})

router.post('https://voteplex-voting.herokuapp.com/api/setting', (req, res, next) => {
    const { email, current, newPassWord} = req.body
    User.findOne({email}).then((payload) => {
        if(bcrypt.compareSync(current, payload.password)){
            User.updateOne({email}, {password: bcrypt.hashSync(newPassWord, bcrypt.genSaltSync(10))}).then(() => {
                res.json({
                    success: true,
                    error: null,
                    payload
                })
            })
        }else{
            res.json({
                success: false,
                error: 'Incorrect Current Password!'
            })
        }
    })
})


router.post('https://voteplex-voting.herokuapp.com/api/submitPoll', (req, res, next) => {
    const { userId, pollName, options, local } = req.body
    const pollOptions = []
        options.map((option) => {
            pollOptions.push({
                name: option,
                votes: 0
            })
        })
  
        
        const dataCollection = local? LocalPolls: GooglePolls
    
        const poll = {
            user: userId,
            name: pollName,
            options: pollOptions
        }

        dataCollection.create(poll).then((payload) => {
            res.json({
                success: true,
                payload: payload
            })
        },(err) => {
            if(err.name === 'BulkWriteError' && err.code === 11000){
                res.json({
                    success: false,
                    error: 'Poll already exist!',
                })
            }
        })
})

router.post('https://voteplex-voting.herokuapp.com/api/votes', (req, res, next) => {
    const { userId, pollName, local } = req.body
    
   if(userId, pollName){

        const dataCollection = local? LocalPolls : GooglePolls
        dataCollection.findOne({user: userId, name: pollName}).then((payload) => {
            res.json(payload)
        })
       
    }
})

router.post('https://voteplex-voting.herokuapp.com/api/updateVotes',(req, res, next) => {
    const { userId, pollName, selectedOption, local } = req.body
    if(userId){
        const dataCollection = local? LocalPolls : GooglePolls
        dataCollection.updateOne(
            {user: userId, name: pollName, 'options.name': selectedOption},
            {$inc: {"options.$.votes": 1}}
        ).then(() => {
            dataCollection.findOne({user: userId, name: pollName}).then((payload) => {
                res.json({
                    payload
                })
            })
        })
    }
    
})

router.post('https://voteplex-voting.herokuapp.com/api/mypoll', (req, res, next) => {
    const {userId, local} = req.body
    if(userId){
        const dataCollection = local? LocalPolls : GooglePolls
        dataCollection.find({user: userId}).then((payload) => {
            res.json({
                myPoll: payload
            })
        })
    }
    
    
})

router.post('https://voteplex-voting.herokuapp.com/api/deleteMyPoll', (req, res, next) => {
    const { userId, deletedPoll, local } = req.body
    if(userId){
        const dataCollection = local? LocalPolls : GooglePolls
        dataCollection.remove({user: userId, name: deletedPoll}).then(() => {
            dataCollection.find({user: userId}).then((payload) => {
                res.json({
                    myPoll: payload
                })
            })
        })
    }
    
    
})









export default router
