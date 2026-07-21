const User = require("../user/user.model");

const getFeed = async () => {
    return await User.find({});
};

module.exports = {
    getFeed
};
