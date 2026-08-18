import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
    UserId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'New Conversation'
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
},{
    timestamps:true
})

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;