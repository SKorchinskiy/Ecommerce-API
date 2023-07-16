const authService = require("../services/auth.service");

async function signUp(req, res) {
  try {
    const user = await authService.signUp(req.body);
    const accessTokenCookie = authService.getCookieWithJwtAccessToken({
      username: user.username,
    });
    res.setHeader("Set-Cookie", [accessTokenCookie]);
    return res.status(201).json({
      success: true,
      user,
    });
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
    const user = await authService.signIn(credentials);
    const accessTokenCookie = authService.getCookieWithJwtAccessToken({
      username: user.username,
    });
    res.setHeader("Set-Cookie", [accessTokenCookie]);
    return res.status(200).json({
      success: true,
      user,
    });
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
    const user = await authService.signOut();
    return res.status(200).json({
      success: true,
      user,
    });
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

module.exports = {
  signUp,
  signIn,
  signOut,
  resetPassword,
};
