const { model, Schema } = require('mongoose')

const newsSchema = new Schema({
    writerId: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'authors'
    },
    writerName: {
        type: String,
        // required: true
    },
    title: {
        type: String,
        // required: true
    },
    slug: {
        type: String,
        // required: true
    },
    image: {
        type: String,
        // required: true
    },
    category: {
        type: String,
        ref: 'category'
        // type: String,
        // required: true
    },
    description: {
        type: String,
        default: ""
    },
    // categories: {
    //     type:String,
    //     // required:true,
    // },
    date: {
        type: String,
        // required: true
    },
    count: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

newsSchema.index({
    title: 'text',
    category: 'text',
    description: 'text'
}, {
    title: 5,
    description: 4,
    category: 2
})


module.exports = model('news', newsSchema)