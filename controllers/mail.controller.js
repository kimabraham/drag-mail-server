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
      body: { subject, bccs, receivers, code, template },
    } = req;

    const auth = configureOAuthClient();
    const tokens = await getOAuthTokens(code, auth);
    auth.setCredentials(tokens);

    const findProject = await Project.findById(template);

    const rows = await Promise.all(
      findProject.component.map((row) => generateHTML(row))
    );

    const result = `<table style="width:100%;"><tr style="width:100%;"><td style="width:100%;background-color:#f5f6fa;padding-top:30px;padding-bottom:30px;"><table style="width:600px;background-color:white;margin:auto;border:0;border-collapse:collapse;">${rows.join(
      ""
    )}</table></td></tr></table>`;

    const receiverStrings = receivers
      .map(({ name, email }) => encodeEmail(name, email))
      .join(", ");

    const bccStrings = bccs
      .map(({ name, email }) => encodeEmail(name, email))
      .join(", ");

    const emailContent = createEmailContent(
      user,
      subject,
      receiverStrings,
      bccStrings,
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
