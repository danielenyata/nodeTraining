const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  forgotPassword,
  resetPassword,
  otpVerify,
} = require("./controllers/AuthController");
const { init } = require("./controllers/MailController");
const { getAllUsers } = require("./controllers/UserController");
const {
  PasswordResetValidator,
  PasswordForgotValidator,
  OTPValidator,
} = require("./validators");

const app = express();
const port = 3000;

//initialize mail transporter
init();
//middlewares
app.use(express.json());
app.use(cors());

//ROUTES
app.get("/", async (req, res) => {
  res.send("Hello World!");
});
// get all users
app.get("/users", getAllUsers);

// verify OTP
app.post("/verify", OTPValidator, otpVerify);

// PASSWORD RESET
app.post("/password/forgot", PasswordForgotValidator, forgotPassword);
app.post("/password/reset/:code", PasswordResetValidator, resetPassword);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
