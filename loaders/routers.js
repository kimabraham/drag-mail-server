const users = require("../routes/users");
const auth = require("../routes/auth");
const projects = require("../routes/projects");
const contacts = require("../routes/contacts");

const routerLoader = async (app) => {
  app.use("/api/auth", auth);
  app.use("/api/projects", projects);
  app.use("/api/users", users);
  app.use("/api/contacts", contacts);
};

module.exports = routerLoader;
