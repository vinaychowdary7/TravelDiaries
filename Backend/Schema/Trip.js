const mongoose = require("mongoose");
const { Schema } = mongoose;

const tripSchema = mongoose.Schema({

    trip_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String
    },
    budget: {
        type: String
    },
    duration: {
        type: String
    },
    stay: {
        type: String,
        maxlength: 200
    },
    content: {
        type: []
    },
    mustvisit: {
        type: [String]
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
    },

}, 
{ 
    timestamps: {
        createdAt: 'publishedAt'
    } 

})

module.exports = mongoose.model("trips", tripSchema);