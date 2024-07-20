const express = require("express");
const pool = require("../models/localdb");
const pharmacyPool = require("../models/pharmacydb");
const methodOverride = require("method-override");
const {
  ensureAuthenticated,
  checkUserType,
} = require("../middleware/middleware");
const router = express.Router();

router.use(methodOverride("_method"));
router.use(setUserData);

router.get("/pharmacy", ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
    res.render("pharmacy");
});

router.get("/pharmacy/inventory", ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  try {
    const medList = await inventoryLists();
    res.render("inventory", { medList });
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
});

router.delete("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

//-------------------functions---------///

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
