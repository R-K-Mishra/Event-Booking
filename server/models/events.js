const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    start: {
        type: Date,
        required: true,
        index: true,
    },
    end: {
        type: Date,
        required: true,
        index: true,
    },
    reg_start: {
        type: Date,
        required: true,
        index: true,
    },
    reg_end: {
        type: Date,
        required: true,
        index: true,
    },
    mode: {
        type: String,
        enum: ['online', 'offline'],
        default: 'online',
        index: true,
    },
    venue: {
        name: {
            type: String,
            index: true,
        },
        address: {
            type: String,
        },
        country: {
            type: String,
            index: true,
        },
        coordinates: [
            {
                type: Number,
            }
        ]
    },
    description: {
        type: String,
        required: true,
        index: true,
    },
    images: [
        {
            type: String,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true,
    },
    bookedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    ],
    savedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    ],
    comments: [
        {
            text: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            likes:{
                type: Number,
                default: 0
            }
        }
    ],
    rating: {
        value: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    tags: [
        {
            type: String,
            index: true,
        }
    ]
});

eventSchema.index({ 'title': 1, 'start': 1, 'end': 1, 'venue.country': 1, 'tags': 1 });

module.exports = mongoose.model('event', eventSchema);