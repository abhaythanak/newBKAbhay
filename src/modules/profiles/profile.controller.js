const profileService = require("./profile.service");
const asyncHandler = require("../../utils/asyncHandler");
const { validateEditProfileData } = require("./profile.schema");

const viewProfile = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

const editProfile = asyncHandler(async (req, res) => {
    validateEditProfileData(req.body);
    const updatedUser = await profileService.updateProfile(req.user, req.body);
    res.status(200).json({
        message: `${updatedUser.firstName}, your profile updated successfully!!`,
        data: updatedUser
    });
});

module.exports = {
    viewProfile,
    editProfile
};
