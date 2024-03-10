exports.verifyAuth = (req, res, next) => {
  try {
    if (req.user) {
      res.json({
        success: true,
        message: "Successfully Loged In",
        user: req.user,
      });
    } else {
      throw Error("Not authorized");
    }
  } catch (error) {
    next(error);
  }
};

exports.failedAuth = (req, res, next) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
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

exports.signUp = async (req, res, next) => {};
exports.signIn = async (req, res, next) => {};
