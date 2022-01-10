const db = require("../models/index");
const { validationResult } = require("express-validator");
const { errorFormatter } = require("../validators");

//Create transaction PIN
const createPin = async (req, res) => {
  //validatationResult takes int he request it goes through the request body(submitted data)
  //and validate it
  //if there are errors it will send as errors
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  //1. Verify if user is signed in
  //by get the user object from the request
  let user = req.user;

  //getting the models from the database
  const { User } = db.sequelize.models;

  //Fetching user details from database
  let storeDetails = await User.findOne({ where: { email: user.identifier } });

  //2 . Get Pin from User
  let pin = req.body.pin;

  //3. Store Pin from User
  storeDetails.pin = pin;
  await storeDetails.save();

  res.json({ message: "Created Pin Sucessfully", storeDetails, pin });
};

module.exports = {
  createPin,
};
