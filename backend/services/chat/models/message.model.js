import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
    },
    image: {
        type: String,
        default: null
    }
},{
    timestamps:true
})

const Message = mongoose.model('Message', messageSchema);
export default Message;