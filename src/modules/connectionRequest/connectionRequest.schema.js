const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const validateSendRequest = (params) => {
    const { status, toUserId } = params;
    if (!["ignore", "interested"].includes(status)) {
        throw new Error("invalid status type: " + status);
    }
    if (!toUserId || !objectIdRegex.test(toUserId)) {
        throw new Error("Invalid user ID format");
    }
};

const validateReviewRequest = (params) => {
    const { status, requestId } = params;
    if (!["accepted", "rejected"].includes(status)) {
        throw new Error("status not allowed: " + status);
    }
    if (!requestId || !objectIdRegex.test(requestId)) {
        throw new Error("Invalid request ID format");
    }
};

module.exports = {
    validateSendRequest,
    validateReviewRequest
};
