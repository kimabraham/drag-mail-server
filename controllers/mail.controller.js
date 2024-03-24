const { google } = require("googleapis");
const { configureOAuthClient, getOAuthTokens } = require("../utils/auth");
const { encodeWord } = require("../utils/sendMail");

exports.sendMail = async (req, res, next) => {
  try {
    const {
      user,
      body: { subject, receivers, code },
    } = req;

    const auth = configureOAuthClient();
    const tokens = await getOAuthTokens(code, auth);
    auth.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth });

    const emailLines = [];

    const encodedSubject = encodeWord(subject);
    const receiverStrings = receivers
      .map((receiver) => {
        const encodedName = encodeWord(receiver.name);
        return `${encodedName} <${receiver.email}>`;
      })
      .join(", ");

    emailLines.push(`From: "${user.name}" <${user.email}>`);
    emailLines.push(`To: ${receiverStrings}`);
    // if (bccReceivers && bccReceivers.length > 0) {
    //   emailLines.push(`Bcc: ${bccRecipients}`);
    // }
    emailLines.push("Content-type: text/html;charset=utf-8");
    emailLines.push("MIME-Version: 1.0");
    emailLines.push(`Subject: ${encodedSubject}`);
    emailLines.push("");
    emailLines.push("<strong>헬로우월드</strong>");

    const email = emailLines.join("\r\n").trim();

    const base64EncodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    gmail.users.messages.send(
      {
        userId: "me",
        resource: {
          raw: base64EncodedEmail,
        },
      },
      (err, res) => {
        if (err) {
          console.log("The API returned an error: " + err);
          return;
        }
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
