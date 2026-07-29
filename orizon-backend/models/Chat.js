import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ['system', 'user', 'assistant'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const ChatSchema = new mongoose.Schema({
  chatId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  messages: [MessageSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Chat = mongoose.model('Chat', ChatSchema);