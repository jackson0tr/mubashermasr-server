const mongoose = require('mongoose')
const db_connect =  () => {
    mongoose.connect(process.env.db_production_url).then((data)=>{
        console.log(`poduction database connect ${data.connection.host}`)
    })
}

module.exports = db_connect