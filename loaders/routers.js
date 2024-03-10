const users = require("../routes/users");
const auth = require("../routes/auth");
const projects = require("../routes/projects");

const routerLoader = async (app) => {
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/projects", projects);
};

module.exports = routerLoader;
