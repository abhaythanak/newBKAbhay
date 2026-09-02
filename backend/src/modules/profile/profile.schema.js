const validator = require("validator");

const validateEditProfileData = (body) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "about",
    "age",
    "skills",
  ];
  const isEditAllowed = Object.keys(body).every((field) =>
    allowedEditFields.includes(field),
  );
  if (!isEditAllowed) {
    throw new Error("Invalid fields in edit request");
  }
  if (body.emailId && !validator.isEmail(body.emailId)) {
    throw new Error("Email is not valid");
  }
};

module.exports = {
  validateEditProfileData,
};
