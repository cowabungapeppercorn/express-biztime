const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();

router.get("/", async function(req, res, next) {
  try {
      const results = await db.query(
        `SELECT code, name, description
         FROM companies`);
    return res.json({companies: results.rows});
      
  } catch (err) {
    return next(err);
  }
});

router.get("/:code", async function(req, res, next) {
  try {
      const code = req.params.code

      const results = await db.query(
        `SELECT code, name, description
         FROM companies
         WHERE code=$1`,[code]
         );

    return res.json({company: results.rows[0]});
      
  } catch (err) {
    return next(err);
  }
});


router.post("/", async function(req, res, next) {
  try {

      const { code, name, description } = req.body

      const results = await db.query(
        `INSERT INTO companies (code, name, description)
         VALUES ($1, $2, $3)
         RETURNING code, name, description`, [code, name, description]
         );

    return res.status(201).json({company: results.rows[0]});
      
  } catch (err) {
    return next(err);
  }
});

router.put("/:code", async function(req, res, next) {
  try {

      const { name, description } = req.body

      const results = await db.query(
        `UPDATE companies SET name=$1, description=$2
         WHERE code=$3
         RETURNING code, name, description`, [name, description, req.params.code]
         );
    
    if (!(results.rows[0].hasOwnProperty("code"))) {
        throw new ExpressError(`company cannot be found`, 404);
    }

    return res.json({company: results.rows[0]});
      

  } catch (err) {
    return next(err);
  }
});


router.delete("/:code", async function(req, res, next) {
  try {


      const results = await db.query(
        `DELETE FROM companies 
         WHERE code=$1`, [req.params.code]
         );
    
    if ((results.rows.length === 0)) {
        throw new ExpressError(`company cannot be found`, 404);
    }

    return res.json({message: "deleted"});
      

  } catch (err) {
    return next(err);
  }
});










module.exports = router;
