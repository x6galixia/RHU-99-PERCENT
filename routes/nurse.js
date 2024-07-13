const express = require("express");
const citizenPool = require("../models/citizendb");
const pool = require("../models/localdb");
const methodOverride = require("method-override");
const {
  ensureAuthenticated,
  checkUserType,
} = require("../middleware/middleware");
const router = express.Router();

router.use(methodOverride("_method"));
router.use(setUserData);

router.get(
  "/nurse",
  ensureAuthenticated,
  checkUserType("nurse"),
  (req, res) => {
    res.render("nurse", { user: req.user });
  }
);

router.get("/api/citizen/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await citizenPool.query(
      "SELECT * FROM citizen WHERE unq_id = $1",
      [id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post(
  "/nurse/send-patient-info",
  ensureAuthenticated,
  checkUserType("nurse"),
  async (req, res) => {
    try {
      const {
        unq_id,
        last_name,
        first_name,
        middle_name,
        address,
        barangay,
        town,
        birthdate,
        gender,
        phone,
        email,
        philhealth_no,
        occupation,
        guardian,
        height,
        weight,
        systolic,
        diastolic,
        temperature,
        pulse_rate,
        respiratory_rate,
        bmi,
        comment,
      } = req.body;

      const query = `
            INSERT INTO patients (unq_id, last_name, first_name, middle_name, address, barangay, town,
            birthdate, gender, phone, email, philhealth_no, occupation,
            guardian, height, weight, systolic, diastolic, temperature,
            pulse_rate, respiratory_rate, bmi, comment)
            VALUES ($1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13,
            $14, $15, $16, $17, $18, $19,
            $20, $21, $22, $23)
            RETURNING *;
        `;

      const values = [
        unq_id,
        last_name,
        first_name,
        middle_name,
        address,
        barangay,
        town,
        birthdate,
        gender,
        phone,
        email,
        philhealth_no,
        occupation,
        guardian,
        height,
        weight,
        systolic,
        diastolic,
        temperature,
        pulse_rate,
        respiratory_rate,
        bmi,
        comment,
      ];

      const result = await pool.query(query, values);
      res.render("nurse", { user: req.user });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

router.delete("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function setUserData(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.firstname = req.user.firstname
    res.locals.surname = req.user.surname
    res.locals.middle_initial = req.user.middle_initial
    res.locals.profession = req.user.profession
  } else {
    res.locals.firstname = null
    res.locals.surname = null
    res.locals.middle_initial = null
    res.locals.profession = null
  }
  next();
}

module.exports = router;
