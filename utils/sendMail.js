const { google } = require("googleapis");
const Node = require("../models/Node");

const encodeWord = (word) => {
  return `=?UTF-8?B?${Buffer.from(word).toString("base64")}?=`;
};

exports.encodeEmail = (name, email) => {
  const encodedName = encodeWord(name);
  return `${encodedName} <${email}>`;
};

exports.createEmailContent = (user, subject, receiverStrings, content) => {
  const emailLines = [
    `From: "${exports.encodeEmail(user.name, user.email)}"`,
    `To: ${receiverStrings}`,
    "Content-type: text/html;charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${encodeWord(subject)}`,
    "",
    `${content}`,
  ];

  return emailLines.join("\r\n").trim();
};

exports.sendEmail = async (auth, base64EncodedEmail) => {
  const gmail = google.gmail({ version: "v1", auth });

  try {
    await gmail.users.messages.send({
      userId: "me",
      resource: { raw: base64EncodedEmail },
    });
    return true;
  } catch (err) {
    console.log("The API returned an error: " + err);
    return false;
  }
};

function camelToKebabCase(string) {
  return string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function styleToString(style) {
  return Object.entries(style)
    .map(([key, value]) => `${camelToKebabCase(key)}: ${value};`)
    .join(" ");
}

function propsToString(props) {
  return Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
}

exports.generateHTML = async (nodeId) => {
  const buildNodeHtml = async (nodeId) => {
    const node = await Node.findById(nodeId);
    let html = `<${node.tag} ${
      node.props ? ` ${propsToString(node.props)}` : ""
    } id="${node.nodeId}" class="${node.className}" style="${styleToString(
      node.style
    )}">`;

    if (node.inner) {
      html += node.inner;
    }

    if (node.children && node.children.length > 0) {
      for (const childId of node.children) {
        const childHtml = await buildNodeHtml(childId);
        html += childHtml;
      }
    }

    html += `</${node.tag}>`;
    return html;
  };

  return buildNodeHtml(nodeId);
};
