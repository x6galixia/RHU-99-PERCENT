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
    const getListBeneficiaryIndex = await beneficiaryIndexList();
    res.render("beneficiary", {getListBeneficiary, getListBeneficiaryIndex});
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

router.post("/pharmacy/add-medicine", async (req, res) => {
  try {
    const {product_id, product_code, product_name, brand_name, supplier, dosage_form, dosage, reorder_level, batch_number, date_added, expiration, product_quantity} = req.body;
  
  await pharmacyPool.query("INSERT INTO inventory (product_id, product_code, product_name, brand_name, supplier, dosage_form, dosage, reorder_level, batch_number, date_added, expiration, product_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [product_id, product_code, product_name, brand_name, supplier, dosage_form, dosage, reorder_level, batch_number, date_added, expiration, product_quantity]);

  res.render("addmedicine");
  } catch (error) {
    console.log("ERrror: Error adding medicine");
  }
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
    let peopleList = [];

    if (beneficiary.rows.length > 0) {
      peopleList = beneficiary.rows.map(list => ({
        ...list
      }));
    }
    return peopleList;
  } catch (err) {
    console.log("Error: no data");
    return [];
  }
}

async function beneficiaryIndexList() {
  try {
    const result = await pharmacyPool.query("SELECT * FROM beneficiary");
    const peopleList = result.rows.map(row => {
      const transactionNumber = Array.isArray(row.transaction_number) ? row.transaction_number : [];
      const productDetails = Array.isArray(row.product_details) ? row.product_details : [];
      const productQuantity = Array.isArray(row.quantity) ? row.quantity : [];
      const batchNumber = Array.isArray(row.batch_number) ? row.batch_number : [];
      const expirationDate = Array.isArray(row.expiration_date) ? row.expiration_date : [];
      const dateIssued = Array.isArray(row.date_issued) ? row.date_issued : [];
      const prescribingDoctor = Array.isArray(row.prescribing_doctor) ? row.prescribing_doctor : [];
      const requestingPerson = Array.isArray(row.requesting_person) ? row.requesting_person : [];
      const relationshipToBeneficiary = Array.isArray(row.relationship_beneficiary) ? row.relationship_beneficiary : [];
      
      return {
        ...row,
        transaction_number: transactionNumber,
        product_details: productDetails,
        quantity: productQuantity,
        batch_number: batchNumber,
        expiration_date: expirationDate,
        date_issued: dateIssued,
        prescribing_doctor: prescribingDoctor,
        requesting_person: requestingPerson,
        relationship_beneficiary: relationshipToBeneficiary
      };
    });
    return peopleList;
  } catch (err) {
    console.error("Error: no data", err);
    return [];
  }
}

async function forDispense() {
  try {
    const dispense = await pool.query("SELECT * FROM prescription");
    let dispenseList = [];

    if (dispense.rows.length > 0) {
      dispenseList = dispense.rows.map(list => ({
        ...list,
        check_date: formatDate(list.check_date)
      }));
    }
    return dispenseList;
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
