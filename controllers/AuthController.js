
const bcrypt = require("bcryptjs");
const { errorFormatter } = require("../validators");
const { validationResult } = require("express-validator");


const registerUser = async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
  
    const { email, password, firstName, lastName, pin, phone } = req.body;
  
    try {
      // hash password
      const passwordHash = await hashPassword(password);
      //check if user email and phone number are take
      let taken = await db.User.findOne({ where: { email } });
      if (taken) {
        return res.status(400).json({ message: "Email is taken" });
      }
    
      // create user with data
      const result = await db.User.create({
        email,
        password: passwordHash,
        firstName,
        lastname: lastName,
        phone,
        pin
      })

module.exports= registerUser