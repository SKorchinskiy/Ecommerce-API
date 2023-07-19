const authService = require("../services/auth.service");

async function signUp(req, res, next) {
  try {
    const user = await authService.signUp(req.body);
    const { accessTokenCookie, token } =
      authService.getCookieWithJwtAccessToken({
        username: user.username,
      });
    res.setHeader("Set-Cookie", [accessTokenCookie]);
    return res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function signIn(req, res, next) {
  try {
    const credentials = req.body;
    const user = await authService.signIn(credentials);
    const { accessTokenCookie, token } =
      authService.getCookieWithJwtAccessToken({
        username: user.username,
      });
    res.setHeader("Set-Cookie", [accessTokenCookie]);
    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function signOut(req, res, next) {
  try {
    res.clearCookie("Authentication");
    return res.status(200).json({
      success: true,
      message: `Successfully signed out!`,
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  // password reset via email
}

module.exports = {
  signUp,
  signIn,
  signOut,
  resetPassword,
};
