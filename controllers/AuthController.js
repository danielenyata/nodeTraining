const db = require("../models/index");
const { genStr, addMinutes, hashPassword } = require("../util");
const { sendMail } = require("../controllers/MailController");
const { validationResult } = require("express-validator");
const { createJWT } = require("../middleware/Auth");
const { errorFormatter } = require("../validators");

// PASSWORD RESET
// generate password reset link and mail it to user
const forgotPassword = async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  try {
    const { email } = req.body;
    // get models from sequelize
    const { User, Vcode } = db.sequelize.models;

    // check if user with email exists
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // create reset code
    let code = genStr(64);
    let expires_at = addMinutes(new Date(), 10).toISOString();
    // store reset code in db
    let resetCode = await Vcode.create({
      user_id: user.id,
      code,
      expires_at,
    });

    // send mail with reset code
    sendMail(
      "forgot",
      { email: user.email, firstName: user.firstName },
      resetCode.code
    );

    return res.status(200).json({
      message: `Password reset link sent to ${user.email}`,
    });
  } catch (error) {
    return res.status(400).json({ message: "Could not generate reset link" });
  }
};

// Reset user password using params from reset link
const resetPassword = async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const { code } = req.params;
  const { email } = req.query;
  const { password } = req.body;
  const { User, Vcode } = db.sequelize.models;

  try {
    // verify reset code
    let resetCode = await Vcode.findOne({ where: { code } });

    if (!resetCode) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    // verify user
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!(user.id === resetCode.user_id)) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    // check if it's expired
    if (new Date(resetCode.expires_at) < new Date()) {
      return res.status(400).json({ message: "Expired reset code" });
    }

    //reset user's password
    user.password = await hashPassword(password);
    user.save();
    return res.status(200).json({ message: "Password reset" });
  } catch (error) {
    return res.status(400).json({ message: "Could not reset password" });
  }
};

// Verify OTP
const otpVerify = async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  try {
    const { otpCode } = req.body;
    const { User, Vcode } = db.sequelize.models;

    // verify reset code
    let OTP = await Vcode.findOne({ where: { code: otpCode } });

    console.log(OTP);
    if (!OTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // verify user
    let user = await User.findOne({ where: { id: OTP.user_id } });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // check if it's expired
    if (new Date(OTP.expires_at) < new Date()) {
      return res.status(400).json({ message: "Expired OTP" });
    }
    //generate jwt
    let token = createJWT({ name: user.firstName, identifier: user.email });

    return res
      .status(200)
      .json({ message: "User Verified", user: user.email, token });
  } catch (error) {
    return res.status(400).json({ message: "Could not verify OTP" });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  otpVerify,
};
