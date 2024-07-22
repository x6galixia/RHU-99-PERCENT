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

router.get("/pharmacy/inventory", ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  try {
    const medList = await inventoryLists();
    res.render("pharmacy", { medList });
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

router.get("/pharmacy/beneficiary-records", async(req, res) => {
  try {
    const getListBeneficiary = await beneficiaryList();
    res.render("beneficiary", {getListBeneficiary});
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
});

router.get("/pharmacy/dispense", async(req, res) => {
  try {
    const dispenseMed = await forDispense();
    res.render("dispense", {dispenseMed});
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
});

router.get("/pharmacy/add-medicine", (req, res) => {
  res.render("addmedicine");
});


//-------------------functions---------///

async function inventoryLists() {
  try {
    const medicineInventory = await pharmacyPool.query("SELECT * FROM inventory");
    let medicineList = [];

    if (medicineInventory.rows.length > 0) {
      medicineList = medicineInventory.rows.map(med => ({
        ...med,
        expiration: formatDate(med.expiration)
      }));
    }
    return medicineList;
  } catch (err) {
    console.log("Error: no data");
    return [];
  }
}

async function beneficiaryList() {
  try {
    const beneficiary = await pharmacyPool.query("SELECT * FROM beneficiary");
    const peopleList = [];

    if (beneficiary.rows.lenght > 0 ) {
      peopleList = beneficiary.rows.map(list => ({
        ...list
      }))
    }
  } catch (err) {
    console.log("Error: no data");
  }
}

async function forDispense() {
  try {
    const dispense = await pool.query("SELECT * FROM prescription");
    const dispenseList = [];

    if (dispense.rows.length > 0) {
      dispenseList = dispense.rows.map(list => ({
        ...rows,
        check_date: formatDate(list.check_date)
      }))
    }
  } catch (err) {
    console.log("Error: no data");
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
