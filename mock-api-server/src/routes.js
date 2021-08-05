const Router = require("express");
const endpoints = require("./endpoints");

const routes = Router();

/**
 * GET home page
 */
routes.get("/", (req, res) => {
  res.send({ enpointData: endpoints() });
});

module.exports = routes;
