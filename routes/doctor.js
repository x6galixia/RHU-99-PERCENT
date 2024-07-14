const express = require("express");
const pool = require("../models/localdb");
const pharmacyPool = require("../models/pharmacydb");
const methodOverride = require("method-override");
const { ensureAuthenticated, checkUserType } = require("../middleware/middleware");
const router = express.Router();

router.use(methodOverride("_method"));
router.use(setUserData);

router.get("/doctor/dashboard", ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
    const patientListDrop = await getAllPatient();
    res.render("doctor", {
      patientListDrop,
      user: req.user,
    });
});

router.get("/doctor/inventory", ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
  try {
    const medList = await inventoryLists();
    res.render("inventory", { medList }); // Pass medList as an object property
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
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

async function inventoryLists() {
  try {
    const medicineInventory = await pharmacyPool.query("SELECT * FROM inventory");
    let medicineList = [];

    if (medicineInventory.rows.length > 0) {
      medicineList = medicineInventory.rows.map(med => ({
        med_id: med.med_id,
        procurement_date: med.procurement_date,
        date_added: med.date_added,
        generic_name: med.generic_name,
        brand_name: med.brand_name,
        dosage: med.dosage,
        quantity: med.quantity
      }));
    }
    return medicineList;
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

function setUserData(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.firstname = req.user.firstname;
    res.locals.surname = req.user.surname;
    res.locals.middle_initial = req.user.middle_initial;
    res.locals.profession = req.user.profession;
  } else {
    res.locals.firstname = null;
    res.locals.surname = null;
    res.locals.middle_initial = null;
    res.locals.profession = null;
  }
  next();
}

router.delete("/logout", (req, res) => {
  req.logOut(err => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
