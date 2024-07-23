const express = require("express");
const pool = require("../models/localdb");
const pharmacyPool = require("../models/pharmacydb");
const methodOverride = require("method-override");
const { ensureAuthenticated, checkUserType } = require("../middleware/middleware");
const router = express.Router();

router.use(methodOverride("_method"));
router.use(setUserData);

router.get("/doctor/dashboard", ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
    try {
        const patientListDrop = await getAllPatients();
        res.render("doctor", {
            patientListDrop,
            user: req.user
        });
    } catch (err) {
        console.error("Error fetching patients:", err);
        req.flash("error", "An error occurred while loading the dashboard.");
        res.redirect('/login');
    }
});

router.get('/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send('Query parameter is required');
    }

    try {
        const result = await pharmacyPool.query(
            'SELECT product_name, dosage, product_quantity FROM inventory WHERE product_name ILIKE $1 LIMIT 30',
            [`${query}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/send-prescription', ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
    try {
        let { unq_id, full_name, age, gender, check_date, full_address, phone, guardian, medicine, instruction, quantity, reciever, relationship, doctor_name } = req.body;

        await pool.query(
            "UPDATE patients SET medicine = medicine || $1, instruction = instruction || $2, quantity = quantity || $3 WHERE unq_id = $4",
            [[medicine], [instruction], [quantity], unq_id]
        ); 

        let dosage = null;

        let regex = /(.*)\s(\d+mg)/;
        let match = medicine.match(regex);

        if (match) {
        medicine = match[1];
        dosage = match[2];
        }
        
        await pool.query(
            "INSERT INTO prescription (full_name, age, gender, check_date, full_address, phone, guardian, medicine, instruction, quantity, dosage, reciever, relationship, doctor_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)", 
            [full_name, age, gender, check_date, full_address, phone, guardian, medicine, instruction, quantity, dosage, reciever, relationship, doctor_name]
        );       
        
        const patientListDrop = await getAllPatients();
        res.render('doctor', {
            patientListDrop,
            user: req.user
        });
    } catch (err) {
        console.error("Error Sending prescription:", err);
        req.flash("error", "An error occurred while sending the prescription: " + err.message);
        res.redirect('/doctor/dashboard');
    }
});

router.post('/labrequest', ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
    try {
        const { unq_id, category, service } = req.body;

        await pool.query('BEGIN');
        console.log('Transaction started');

        const unq_ids = Array.isArray(unq_id) ? unq_id : [unq_id];
        const categories = Array.isArray(category) ? category : [category];
        const services = Array.isArray(service) ? service : [service];

        for (let i = 0; i < unq_ids.length; i++) {
            const query = "UPDATE patients SET category = $1, service = $2 WHERE unq_id = $3";
            await pool.query(query, [categories, services, unq_ids[i]]);
        }

        await pool.query('COMMIT');
        console.log('Transaction committed');

        const patientListDrop = await getAllPatients();
        console.log("Updated patient list:", patientListDrop);
        res.render('doctor', {
            patientListDrop,
            user: req.user
        });

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Error adding request:", err);
        req.flash("error", "An error occurred while adding request: " + err.message);
        res.redirect('/doctor/dashboard');
    }
});

router.post('/add-diagnoses', ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
    try {
        const { unq_id, diagnoses } = req.body;

        const query = "UPDATE patients SET diagnoses = $1 WHERE unq_id = $2";
        await pool.query(query, [diagnoses, unq_id]);

        const patientListDrop = await getAllPatients();
        res.render('doctor', {
            patientListDrop,
            user: req.user
        });
    } catch (err) {
        console.error("Error adding diagnoses:", err);
        req.flash("error", "An error occurred while adding diagnoses: " + err.message);
        res.redirect('/doctor/dashboard');
    }
});

router.post('/add-findings', ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
    try {
        const { unq_id, findings } = req.body;

        const query = "UPDATE patients SET findings = $1 WHERE unq_id = $2";
        await pool.query(query, [findings, unq_id]);

        const patientListDrop = await getAllPatients();
        res.render('doctor', {
            patientListDrop,
            user: req.user
        });
    } catch (err) {
        console.error("Error adding findings:", err);
        req.flash("error", "An error occurred while adding findings: " + err.message);
        res.redirect('/doctor/dashboard');
    }
});

router.post('/search-patient', ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
    try {
        const { search } = req.body;

        const searchResult = await pool.query(
            "SELECT * FROM patients WHERE unq_id ILIKE $1 OR last_name ILIKE $2",
            [`%${search}%`, `%${search}%`]
        );

        const result = searchResult.rows.map(row => ({
            ...row,
            check_date: formatDate(row.check_date),
            birthdate: formatDate(row.birthdate),
            age: calculateAge(formatDate(row.birthdate))
        }));

        const patientListDrop = await getAllPatients();
        res.render('doctor', {
            patientListDrop: result,
            user: req.user
        });
    } catch (err) {
        console.error("Error searching patients:", err);
        req.flash("error", "An error occurred while searching for patients: " + err.message);
        res.redirect('/doctor/dashboard');
    }
});

//----------------------------> Functions

async function getAllPatients() {
    try {
        const viewPatients = await pool.query("SELECT * FROM patients");

        const patients = viewPatients.rows.map(row => {
            const checkDateFormatted = formatDate(row.check_date);
            const birthdateFormatted = formatDate(row.birthdate);
            const age = calculateAge(row.birthdate);

            const labResults = Array.isArray(row.lab_result) ? row.lab_result : [];

            return {
                ...row,
                check_date: checkDateFormatted,
                birthdate: birthdateFormatted,
                age: age,
                lab_result: labResults
            };
        });
        
        patients.sort((a, b) => {
            const dateA = new Date(a.check_date);
            const dateB = new Date(b.check_date);
            return dateB - dateA;
        });

        return patients;
    } catch (err) {
        console.error("Error fetching patients:", err);
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
