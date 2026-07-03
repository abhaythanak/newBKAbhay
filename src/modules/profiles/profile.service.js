const updateProfile = async (user, updateData) => {
    Object.keys(updateData).forEach((key) => {
        user[key] = updateData[key];
    });
    return await user.save();
};

module.exports = {
    updateProfile
};
