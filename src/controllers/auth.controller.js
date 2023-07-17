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
      accessTokenCookie,
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
    res.clearCookie("Authentication");
    return res.status(200).json({
      success: true,
      message: `Successfully sign out!`,
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
