const express = require("express");
const pool = require("../models/localdb");
const methodOverride = require("method-override");
const { ensureAuthenticated, checkUserType } = require("../middleware/middleware");
const router = express.Router();

router.use(methodOverride("_method"));

router.get("/doctor/dashboard", ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
    const patientListDrop = await getAllPatient();
    res.render("doctor", {
      patientListDrop,
      user: req.user,
    });
});

router.post('/search-patient', ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
  try {
    const { search } = req.body;

    const searchResult = await pool.query(
      "SELECT * FROM patients WHERE unq_id ILIKE $1 OR last_name ILIKE $2",
      [`%${search}%`, `%${search}%`]
    );

    let result = [];
    if (searchResult.rows.length > 0) {
      result = searchResult.rows.map(row => ({
        unq_id: row.unq_id,
        last_name: row.last_name,
        first_name: row.first_name,
        middle_name: row.middle_name,
        address: row.address,
        barangay: row.barangay,
        town: row.town,
        birthdate: formatDate(row.birthdate),
        age: calculateAge(formatDate(row.birthdate)),
        gender: row.gender,
        phone: row.phone,
        email: row.email,
        philhealth_no: row.philhealth_no,
        occupation: row.occupation,
        guardian: row.guardian,
        height: row.height,
        weight: row.weight,
        systolic: row.systolic,
        diastolic: row.diastolic,
        temperature: row.temperature,
        pulse_rate: row.pulse_rate,
        respiratory_rate: row.respiratory_rate,
        bmi: row.bmi,
        comment: row.comment,
        diagnoses: row.diagnoses,
        findings: row.findings,
        orders: row.orders,
        medicine: row.medicine,
        instruction: row.instruction,
        quantity: row.quantity,
        tests: row.tests,
        prescription_date: row.prescription_date,
        lab_result: row.lab_result
      }));
    }

    const patientListDrop = await getAllPatient();

    res.render('doctor', {
      patientListDrop: result,
      user: req.user,
    });
  } catch (err) {
    console.error("Error:", err);
    req.flash("error", "An error occurred while searching for patients: " + err.message);
    res.redirect('/doctor/dashboard');
  }
});



router.delete("/logout", (req, res) => {
  req.logOut(err => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

//----------------------------> functions

async function getAllPatient() {
  try {
    const viewPatients = await pool.query("SELECT * FROM patients");
    let patientsList = [];
    if (viewPatients.rows.length > 0) {
      patientsList = viewPatients.rows.map(row => ({
        unq_id: row.unq_id,
        last_name: row.last_name,
        first_name: row.first_name,
        middle_name: row.middle_name,
        address: row.address,
        barangay: row.barangay,
        town: row.town,
        birthdate: formatDate(row.birthdate),
        age: calculateAge(formatDate(row.birthdate)),
        gender: row.gender,
        phone: row.phone,
        email: row.email,
        philhealth_no: row.philhealth_no,
        occupation: row.occupation,
        guardian: row.guardian,
        height: row.height,
        weight: row.weight,
        systolic: row.systolic,
        diastolic: row.diastolic,
        temperature: row.temperature,
        pulse_rate: row.pulse_rate,
        respiratory_rate: row.respiratory_rate,
        bmi: row.bmi,
        comment: row.comment,
        diagnoses: row.diagnoses,
        findings: row.findings,
        orders: row.orders,
        medicine: row.medicine,
        instruction: row.instruction,
        quantity: row.quantity,
        tests: row.tests,
        prescription_date: row.prescription_date,
        lab_result: row.lab_result
      }));
    }
    return patientsList;
  } catch (err) {
    console.log("Error: no data");
    return [];
  }
}

function calculateAge(birthdateString) {
  const birthdate = new Date(birthdateString);
  const today = new Date();

  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();
  const dayDifference = today.getDate() - birthdate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }
  return age;
}

function formatDate(dateString) {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

module.exports = router;
