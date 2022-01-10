const { body } = require("express-validator");

const errorFormatter = ({ msg }) => {
  return `${msg}`;
};

// Reset Password Validator
const PasswordResetValidator = [
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Enter password with at least 8 characters"),
  body("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Enter password with at least 8 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];
// Forgot Password Validator
const PasswordForgotValidator = [
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Provide a valid email")
    .isLength({ min: 5 }),
];

//Verify OTP Validator
const OTPValidator = [
  body("otpCode")
    .exists({ checkFalsy: true })
    .withMessage("OTP is required")
    .bail()
    .trim()
    .isNumeric()
    .withMessage("OTP has to be a number")
    .isLength({ min: 4, max: 4 })
    .withMessage("OTP has to be exactly 4 numbers"),
];

module.exports = {
  errorFormatter,
  PasswordResetValidator,
  PasswordForgotValidator,
  OTPValidator,
};
