const authService = require("./auth.service");
const asyncHandler = require("../../utils/asyncHandler");
const { validateSignupData, validateLoginData } = require("./auth.schema");

const signup = asyncHandler(async (req, res) => {
  validateSignupData(req.body);
  const user = await authService.signup(req.body);
  res.status(201).json({ message: "User created successfully", user });
});

const login = asyncHandler(async (req, res) => {
  validateLoginData(req.body);
  const { emailId, password } = req.body;
  const { user, token } = await authService.login(emailId, password);

  res.cookie("token", token, {
    expires: new Date(Date.now() + 8 * 3600000),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Login successful",
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout Successully!!!.");
});

module.exports = {
  signup,
  login,
  logout,
};
