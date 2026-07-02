const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", // referance to the user collection i want to connect this with user schema for show the data
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
    { timestamps: true, })


    // indexing to fast way to access data base from search like functionality or etc.
    //. 1 is accending and -1 is decending 
    // fast it search this is called compounding indexing
    connectionRequestSchema.index({fromUserId:1,toUserId:1})

    //. check to cannot send request self 

    connectionRequestSchema.pre("save",function(next){
        const connectionRequest = this;
        // check fromUserId === toUserId 
        if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
            throw new Error("cannot send request to self")
        }
        next()
    })


    const ConnectionRequestModel = new mongoose.model(
        "ConnectionRequest",connectionRequestSchema
    )

    module.exports = ConnectionRequestModel