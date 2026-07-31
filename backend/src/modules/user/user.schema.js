const validator = require("validator");

const validateUpdateUser = (body) => {
    const { userId } = body;
    if (!userId) {
        throw new Error("userId is required");
    }
    if (body.emailId && !validator.isEmail(body.emailId)) {
        throw new Error("Email is not valid");
    }
};

const validateGetUser = (body) => {
    const { emailId } = body;
    if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Valid emailId is required");
    }
};

const validateDeleteUser = (body) => {
    const { userId } = body;
    if (!userId) {
        throw new Error("userId is required");
    }
};

module.exports = {
    validateUpdateUser,
    validateGetUser,
    validateDeleteUser
};
