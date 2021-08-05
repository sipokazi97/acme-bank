const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes");
const jsonServer = require("json-server");
const endpoints = require("./endpoints");

// Create Express instance
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// The function listens for req.on(‘data’) and constructs req.body from the chunks of data it gets.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set frontend folder
app.use(express.static(path.join(__dirname, "../public")));

// We don't need this header
app.disable("x-powered-by");

// View engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

// Capture body and parse to Query-string
// Convent POST to GET
// Redirect to JSON-SERVER for normal results
app.use((req, res, next) => {
  let url = req.protocol + "://" + req.get("host") + req.path;
  next();
});

// Enable default route
app.use("/", routes);

// Json-Server should return object not array for the /post api
function modifyResponse(req, res, next) {
  console.log("--> making request @", Date.now());
  next();
}

/**
 *
 * @param {*} str
 */
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// Enable API routes
app.use("/api/", jsonServer.router(endpoints()));

module.exports = app;
