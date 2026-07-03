const User = require("../users/user.model");

const getFeed = async () => {
    return await User.find({});
};

module.exports = {
    getFeed
};
