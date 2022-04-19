const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");
const app = express();
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

dotenv.config({
  path: "./.env",
});

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT, //note my port is started at 3307
  user: process.env.DATABASE_USER, //xampp creates user and password automatically with the following data always
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

app.use(express.static(__dirname + "/public"));

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("My Sql connected");
  }
});

//parsing url-encoded bodies as sent by html forms, to grab the data from any forms
app.use(
  express.urlencoded({
    extended: false,
  })
);
// the values that were grabbing as forms comes as json
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/sensorvalues", (req, res) => {
  res.render("sensorvalues");
});

app.get("/minerregister", (req, res) => {
  var lol = "hehe";
  res.render("minerregister", { lol: lol });
});

app.get("/helmetregister", (req, res) => {
  var lol = "hehe";
  console.log("reacher here GET");
  res.render("helmetregister", { lol: lol });
});

app.post("/helmetregister", (req, res) => {
  const { minerid, macid, gas, gyro, temperature } = req.body;

  db.query(
    "INSERT INTO helmetdetails SET ?",
    {
      minerid: minerid,
      macid: macid,
      gas: gas,
      gyro: gyro,
      temperature: temperature,
    },
    (err, results) => {
      if (err) {
        console.log("error!");
        // console.log(err);
      } else {
        console.log("results: ");
        console.log(results);
        //alert("Helmet Details Registered Successfully");
        // req.flash("message", "SS");
        // res.render("helmetregister", { message: req.flash("message") });
      }
    }
  ); //name: name, name from database with name from name in js
  var lol = "lmo";
  return res.render("helmetregister", { lol: lol });
});

app.post("/minerregister", (req, res) => {
  const { username, age, contact, address, econtact, relationship } = req.body;

  db.query(
    "INSERT INTO minerdetails SET ?",
    {
      name: username,
      contact: contact,
      address: address,
      age: age,
      econtact: econtact,
      relationship: relationship,
    },
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log("results");
        console.log(results);
        res.render("minerregister", {
          message: "User registered",
        });
      }
    }
  ); //name: name, name from database with name from name in js
  var lol = "lmo";
  return res.render("minerregister", { lol: lol });
});

app.get("/minerdetails", (req, res) => {
  db.query(
    "select mid,name,age,contact,address,econtact,relationship from  minerdetails",
    (err, found) => {
      if (err) console.log(err);
      console.log(found);
      res.render("minerdetails", { found });
    }
  );
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
