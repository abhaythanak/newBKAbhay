const { verifyToken } = require("../utils/token");
const User = require("../modules/users/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const userAuth = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        throw new ApiError(401, "Please authenticate");
    }
    
    try {
        const decodedObj = verifyToken(token);
        const { _id } = decodedObj;
        
        const user = await User.findById(_id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        
        req.user = user;
        next();
    } catch (err) {
        throw new ApiError(401, "Token is not valid or expired");
    }
});

module.exports = { userAuth };
