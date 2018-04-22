import mongoose from 'mongoose'

const Schema = mongoose.Schema


const GoogleUserSchema = new Schema({
    googleID: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        //unique: true
    },
    picture: {
        type: String
    }
})


const Model = mongoose.model('GoogleUser', GoogleUserSchema)

export default Model