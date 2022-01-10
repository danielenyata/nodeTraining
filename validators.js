const { body } = require("express-validator");

// format error info in a single sentence
const errorFormatter = ({ msg }) => {
  return msg;
};


//Create Pin Validator
const PinValidator = [
  body("pin")
    .exists({ checkFalsy: true })
    .withMessage("Pin is required")
    .bail()
    .trim()
    .isNumeric()
    .withMessage("Pin has to be a number")
    .isLength({ min: 4, max: 4 })
    .withMessage("Pin has to be exactly 4 numbers"),
];

module.exports = {
  errorFormatter,
  PinValidator,
};
