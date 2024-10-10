const { model, Schema } = require('mongoose')

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }

}, { timestamps: true })



module.exports = model('category', categorySchema)