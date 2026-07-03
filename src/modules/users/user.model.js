const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { signToken } = require("../../utils/token");

const userSchema = new mongoose.Schema(
    {
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
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Enter Strong Password: " + value);
                }
            }
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            }
        },
        photoUrl: {
            type: String,
            default: "https://thumbs.dreamstime.com/b/human-brain-gray-background-brainstorming-concept-human-brain-floating-dark-background-134264032.jpg?w=768"
        },
        about: {
            type: String,
            default: "this is the default about the user"
        },
        skills: {
            type: [String],
        }
    },
    { timestamps: true }
);

userSchema.methods.getJWT = async function () {
    const user = this;
    return signToken({ _id: user._id });
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    return await bcrypt.compare(passwordInputByUser, user.password);
};

module.exports = mongoose.model("User", userSchema);
