const validator = require("validator");

const validateSignupData = (body) => {
  const { firstName, emailId, password } = body;
  if (!firstName || firstName.length < 3 || firstName.length > 50) {
    throw new Error(
      "First name is required and should be between 3 and 50 characters!",
    );
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password");
  }
};

const validateLoginData = (body) => {
  const { emailId, password } = body;
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
  if (!password) {
    throw new Error("Password is required");
  }
};

module.exports = {
  validateSignupData,
  validateLoginData,
};
