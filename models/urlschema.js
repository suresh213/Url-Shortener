const mongoose = require('mongoose')
const urlschema = mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true
    },
    clickcount: {
        type: Number,
        default: 0
    }
})

const urlmodel = mongoose.model("urlshort", urlschema)

module.exports = { urlmodel }