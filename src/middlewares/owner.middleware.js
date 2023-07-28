const { getUserRoles } = require("../services/user.service");

function isResourceOwnerOrAdmin() {
  return async (req, res, next) => {
    const userId = +req.user.id;
    const ownerId = +req.params.id;
    if (userId !== ownerId) {
      const userRoles = await getUserRoles(userId);
      if (!userRoles.includes("admin")) {
        return res.status(403).json({
          success: false,
          message: `Access denied! Proper permissions required!`,
        });
      }
    }
    next();
  };
}

module.exports = { isResourceOwnerOrAdmin };
