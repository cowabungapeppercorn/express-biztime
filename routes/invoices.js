const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();



router.get("/", function(req, res, next) {
  try {
  

  } catch (err) {
    return next(err);
  }
});




module.exports = router;