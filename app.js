const express = require("express");
const morgan = require("morgan");
const pg = require("pg");


const app = express();
const port = 3000;

app.use(express.json());


app.use(morgan("dev"));



// DATABASE CONNECTION
let conString = process.env.DATABASE_URL;
let client = new pg.Client(conString);

client.connect(function (err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  client.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    console.log(result.rows[0].theTime);
    console.log("DB Connected Successfully!");
    client.end();
  });
});



//Create route for Create Pin


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
