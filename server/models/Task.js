const { mongoose } = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task name is required"],
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    data:{
        type: String,
        default: new Date().toISOString().split('T')[0],
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date().toLocaleString()
    }
})

module.exports = mongoose.model('tasks', taskSchema)