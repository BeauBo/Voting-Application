import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import routes from './routes/api'
import bodyParser from 'body-parser'
import passport from 'passport'
import passportSetup from './config'
import authRoutes from './routes/auth'








// Creat a db connection 
const db = const db = process.env.MONGODB_URI || process.env.localDB

//Creat port for server to listen on 
const port = process.env.PORT || 4000

//instatiate express app
const app = express()



//set up express middlewares

app.use(bodyParser.json())
app.use(passport.initialize())
app.use(express.static('public'))
app.use(authRoutes)
app.use(routes)


//Connect to mongodb
mongoose.connect(db, (err) => {
  if (err) {
    console.log(err)
  }
})

mongoose.connection.on('connected', () => {
  console.log('Successfully opened a connection to ' + db)
})

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from ' + db)
})

mongoose.connection.on('error', () => {
  console.log('An error has occured connecting to ' + db)
})


app.listen(port, () => {
    console.log('Server is listening requests on ' + port)
})



