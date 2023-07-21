const db = require("../configs/db.config");
const { getUserRoles } = require("../services/user.service");

function isGrantedAccess(...roles) {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return req.status(401).json({
        success: false,
        message: `Access denied! Please, authenticate!`,
      });
    }
    const userRoles = await getUserRoles(user.id);
    const matchingRoles = userRoles.filter((role) => roles.includes(role));
    if (!matchingRoles.length) {
      return res.status(403).json({
        success: false,
        message: `Access denied! Proper permissions required!`,
      });
    }
    next();
  };
}

module.exports = {
  isGrantedAccess,
};
