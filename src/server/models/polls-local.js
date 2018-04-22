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
const LocalPollSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    options: [OptionSchema]
})


const Model = mongoose.model('LocalPolls', LocalPollSchema)

export default Model