const User = require("../user/user.model");
const bcrypt = require("bcrypt");
const ApiError = require("../../utils/ApiError");

const signup = async (userData) => {
    const { emailId, password, ...rest } = userData;
    
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
        throw new ApiError(400, "Email Id already present.");
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
        emailId,
        password: passwordHash,
        ...rest
    });
    
    return await user.save();
};

const login = async (emailId, password) => {
    const user = await User.findOne({ emailId });
    if (!user) {
        throw new ApiError(400, "Invalid Credentials");
    }
    
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Credentials");
    }
    
    const token = await user.getJWT();
    return { user, token };
};

module.exports = {
    signup,
    login
};
