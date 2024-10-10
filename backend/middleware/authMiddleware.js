const passport = require("../passport");

const authenticate = passport.authenticate("jwt", { session: false });

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to perform this action.",
        });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
