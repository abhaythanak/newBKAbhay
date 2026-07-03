const userService = require("./user.service");
const asyncHandler = require("../../utils/asyncHandler");
const { validateUpdateUser, validateGetUser, validateDeleteUser } = require("./user.schema");

const getReceivedRequests = asyncHandler(async (req, res) => {
    const data = await userService.getReceivedRequests(req.user._id);
    res.status(200).json({
        message: "Data fetched successfully",
        data
    });
});

const getConnections = asyncHandler(async (req, res) => {
    const data = await userService.getConnections(req.user._id);
    res.status(200).json({ data });
});

const updateUser = asyncHandler(async (req, res) => {
    validateUpdateUser(req.body);
    const { userId, ...updateData } = req.body;
    await userService.updateUser(userId, updateData);
    res.status(201).send("user updated successfully");
});

const getUser = asyncHandler(async (req, res) => {
    validateGetUser(req.body);
    const user = await userService.getUserByEmail(req.body.emailId);
    res.status(200).send(user);
});

const deleteUser = asyncHandler(async (req, res) => {
    validateDeleteUser(req.body);
    await userService.deleteUser(req.body.userId);
    res.status(201).send("UserDeleted Successfully");
});

module.exports = {
    getReceivedRequests,
    getConnections,
    updateUser,
    getUser,
    deleteUser
};
