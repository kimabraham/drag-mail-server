const Project = require("../models/Project");
const Node = require("../models/Node");
const { configureOAuthClient, getOAuthTokens } = require("../utils/auth");
const {
  createEmailContent,
  encodeEmail,
  sendEmail,
  generateHTML,
} = require("../utils/sendMail");

exports.sendMail = async (req, res, next) => {
  try {
    const {
      user,
      body: { subject, receivers, code, template },
    } = req;

    const auth = configureOAuthClient();
    const tokens = await getOAuthTokens(code, auth);
    auth.setCredentials(tokens);

    const findProject = await Project.findById(template);

    const test = await Promise.all(
      findProject.component.map((row) => generateHTML(row))
    );

    const result = `<table style="width:600px">${test.join("")}</table>`;

    const receiverStrings = receivers
      .map(({ name, email }) => encodeEmail(name, email))
      .join(", ");
    const emailContent = createEmailContent(
      user,
      subject,
      receiverStrings,
      result
    );
    const base64EncodedEmail = Buffer.from(emailContent)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const success = await sendEmail(auth, base64EncodedEmail);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).send("Failed to send email");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
