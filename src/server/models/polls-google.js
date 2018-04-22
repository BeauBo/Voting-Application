import mongoose from 'mongoose'

const Schema = mongoose.Schema

const OptionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    votes: {
        type: Number,
        default: 0
    }

})
const GooglePollsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'GoogleUser'
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    options: [OptionSchema]
})


const Model = mongoose.model('GooglePolls', GooglePollsSchema)

export default Model