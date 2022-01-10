const express = require("express");
require("dotenv").config();

const { verifyToken } = require("./middleware/Auth.js");
const {
  createPin,
} = require("./controllers/AuthController");
const {
  PinValidator,
} = require("./validators");

const app = express();
const port = 3000;

app.use(express.json());


//ROUTES

//Create route for Create Pin
//When the post request is made, the function 'createPin' will run sucessfully
app.post("/pin/create", verifyToken, PinValidator, createPin);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
