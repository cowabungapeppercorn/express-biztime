const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();



router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date
         FROM invoices`);
    return res.json({ invoices: results.rows });

  } catch (err) {
    return next(err);
  }
});


router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id

    const results = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date
         FROM invoices
         WHERE id=$1`, [id]
    );

    if (!results.rows.length) {
      throw new ExpressError(`invoice cannot be found`, 404);
    }

    return res.json({ invoice: results.rows[0] });

  } catch (err) {
    return next(err);
  }
});


router.post("/", async function (req, res, next) {
  try {

    const { comp_code, amt } = req.body

    const results = await db.query(
      `INSERT INTO invoices (comp_code, amt)
         VALUES ($1, $2)
         RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]
    );

    return res.status(201).json({ invoice: results.rows[0] });

  } catch (err) {
    return next(err);
  }
});


router.put("/:id", async function (req, res, next) {
  try {

    const { amt } = req.body

    const results = await db.query(
      `UPDATE invoices SET amt=$1
         WHERE id=$2
         RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, req.params.id]
    );

    if (!results.rows.length) {
      throw new ExpressError(`invoice cannot be found`, 404);
    }

    return res.json({ invoice: results.rows[0] });


  } catch (err) {
    return next(err);
  }
});


router.delete("/:id", async function (req, res, next) {
  try {


    const results = await db.query(
      `DELETE FROM invoices 
         WHERE id=$1
         RETURNING id`, [req.params.id]
    );

    if (!results.rows.length) {
      throw new ExpressError(`invoice cannot be found`, 404);
    }

    return res.json({ message: "deleted" });


  } catch (err) {
    return next(err);
  }
});


module.exports = router;