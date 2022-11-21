const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    ticketPriority: {
        type: Number,
        required: true,
        default: 4
    },
    status: {
        type: String,
        required: true,
        default: 'OPEN'
    },
    reporter: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: ()=>{
            return Date.now()
        }
    },
    updatedAt: {
        type: Date,
        default: ()=>{
            return Date.now()
        }
    },
    assignee: String
});

module.exports = mongoose.model('Ticket', ticketSchema);