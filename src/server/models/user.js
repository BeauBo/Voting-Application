import mongoose from 'mongoose'

const Schema = mongoose.Schema


const UserSchema = new Schema ({

    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    
   
})



const Model = mongoose.model('User', UserSchema)

export default Model