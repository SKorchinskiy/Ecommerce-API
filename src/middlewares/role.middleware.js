const db = require("../configs/db.config");

function isGrantedAccess(...roles) {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return req.status(401).json({
        success: false,
        message: `Access denied! Please, authenticate!`,
      });
    }
    const query = `
        SELECT role
        FROM ROLE
        WHERE userId=${user.id}
    `;
    const userRoles = (await db.executeQuery(query)).map((roleObj) => {
      return roleObj.role;
    });
    const intersection = roles.reduce((accumulator, role) => {
      return accumulator + userRoles.includes(role);
    }, 0);
    if (!intersection) {
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
