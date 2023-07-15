const authService = require("../services/auth.service");

async function signUp(req, res) {
  try {
    return await authService.signUp(req.user);
  } catch (error) {
    const { status, message } = error;
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

async function signIn(req, res) {
  try {
    const credentials = req.body;
    return await authService.signIn(credentials);
  } catch (error) {
    const { status, message } = error;
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

async function signOut(req, res) {
  try {
    // figure out what data is needed
    return await authService.signOut();
  } catch (error) {
    const { status, message } = error;
    return res.status(status).json({
      success: false,
      message,
    });
  }
}

async function resetPassword(req, res) {
  // password reset via email
}

async function updatePassword(req, res) {
  // update password using current one
}

module.exports = {
  signUp,
  signIn,
  signOut,
  resetPassword,
  updatePassword,
};
