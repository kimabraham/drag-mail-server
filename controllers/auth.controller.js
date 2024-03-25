exports.verifyAuth = (req, res, next) => {
  try {
    if (req.user) {
      res.json({
        success: true,
        message: "Successfully Loged In",
        user: req.user,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.failedAuth = (_, res, next) => {
  try {
    res.status(401).json({
      error: true,
      message: "Log in failure",
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.redirect(process.env.CLIENT_URL);
  });
};

exports.signUp = () => {};
exports.signIn = () => {};
