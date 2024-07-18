const express = require("express");
const pool = require("../models/localdb");
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

router.post('/labrequest', ensureAuthenticated, checkUserType("doctor"), async (req, res) => {
    try {
        const { unq_id, category, service } = req.body;

        // Begin transaction
        await pool.query('BEGIN');
        console.log('Transaction started');

        // Update each patient with their category and service
        for (let i = 0; i < unq_id.length; i++) {
            const query = "UPDATE patients SET category = $1, service = $2 WHERE unq_id = $3";
            await pool.query(query, [category[i], service[i], unq_id[i]]);
        }

        // Commit transaction
        await pool.query('COMMIT');
        console.log('Transaction committed');

        // Fetch updated patient list and render the dashboard
        const patientListDrop = await getAllPatients();
        res.render('doctor', {
            patientListDrop,
            user: req.user
        });

    } catch (err) {
        // Rollback transaction in case of error
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
        return viewPatients.rows.map(row => ({
            ...row,
            check_date: formatDate(row.check_date),
            birthdate: formatDate(row.birthdate),
            age: calculateAge(formatDate(row.birthdate))
        }));
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

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

module.exports = router;
