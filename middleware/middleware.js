function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkUserType(userType) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.user_type === userType) {
      return next();
    }
    res.redirect("/login");
  };
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    const user = req.user;
    switch (user.user_type) {
      case "medtech":
        return res.redirect("/medtech");
      case "nurse":
        return res.redirect("/nurse");
      case "doctor":
        return res.redirect("/doctor/dashboard");
      case "pharmacist":
        return res.redirect("/pharmacy/inventory");
      default:
        return res.redirect("/");
    }
  }
  next();
}

module.exports = {
  ensureAuthenticated,
  checkUserType,
  checkNotAuthenticated,
};
