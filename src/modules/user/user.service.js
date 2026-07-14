const User = require("./user.model");
const ConnectionRequest = require("../connectionRequest/connectionRequest.model");
const ApiError = require("../../utils/ApiError");

const getReceivedRequests = async (userId) => {
    return await ConnectionRequest.find({
        toUserId: userId,
        status: "interested"
    }).populate("fromUserId", "firstName lastName age gender photoUrl about skills");
};

const getConnections = async (userId) => {
    const SAFE_DATA = "firstName lastName age gender photoUrl about skills";
    const connectionRequests = await ConnectionRequest.find({
        $or: [
            { toUserId: userId, status: "accepted" },
            { fromUserId: userId, status: "accepted" }
        ]
    }).populate("fromUserId", SAFE_DATA).populate("toUserId", SAFE_DATA);
    
    return connectionRequests.map((row) => {
        if (row.fromUserId._id.toString() === userId.toString()) {
            return row.toUserId;
        }
        return row.fromUserId;
    });
};

const updateUser = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(userId, updateData, { 
        returnDocument: "after", 
        runValidators: true 
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};

const getUserByEmail = async (emailId) => {
    const user = await User.findOne({ emailId });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};

const deleteUser = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }
    return deletedUser;
};

module.exports = {
    getReceivedRequests,
    getConnections,
    updateUser,
    getUserByEmail,
    deleteUser
};
