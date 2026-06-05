const mongoose = require("mongoose")

const userModel = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true,
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
        min: 18,
        
    },
    gender: {
        type: String,
        validate(value){
            if (!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default:"https://thumbs.dreamstime.com/b/human-brain-gray-background-brainstorming-concept-human-brain-floating-dark-background-134264032.jpg?w=768"
    },
    about: {
        type: String,
        default: "this is the default about the user"
    },
    skills: {
        type: [String],
    }
})

module.exports = mongoose.model("User", userModel) 