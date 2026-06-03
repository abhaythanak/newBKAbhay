const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect(
    "mongodb+srv://abhaythanak_db_user:UyayE5twYTKgaALa@cluster0.qw9e9gn.mongodb.net/devTinder"
)
}

module.exports = connectDB
