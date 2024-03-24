const { google } = require("googleapis");

exports.configureOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.CLIENT_URL
  );
};

exports.getOAuthTokens = async (code, auth) => {
  const { tokens } = await auth.getToken(code);
  return tokens;
};
