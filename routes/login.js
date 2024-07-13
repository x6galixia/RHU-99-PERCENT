const express = require("express");
const pool = require("../models/localdb");
const passport = require("passport");
const router = express.Router();
const { checkNotAuthenticated } = require("../middleware/middleware");

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login", { error_msg: req.flash("error") });
});

router.post("/login", checkNotAuthenticated, (req, res, next) => {
  console.log("Login attempt:", req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return next(err);
    }
    if (!user) {
      console.log("Authentication failed:", info.message);
      req.flash("error", info.message); // Use the message from Passport
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      const selectedUserType = req.body["user_type"];
      console.log("User type selected:", selectedUserType);
      if (
        !["medtech", "nurse", "doctor", "pharmacist"].includes(selectedUserType)
      ) {
        req.flash("error", "Invalid user type.");
        return res.redirect("/login");
      }
      switch (selectedUserType) {
        case "medtech":
          return res.redirect("/medtech");
        case "nurse":
          return res.redirect("/nurse");
        case "doctor":
          return res.redirect("/doctor/dashboard");
        case "pharmacist":
          return res.redirect("/pharmacist");
        default:
          return res.redirect("/");
      }
    });
  })(req, res, next);
});

module.exports = router;
