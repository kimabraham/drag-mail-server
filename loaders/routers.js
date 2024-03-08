const users = require("../routes/users");
const projects = require("../routes/projects");

const routerLoader = async (app) => {
  app.use("/api/users", users);
  app.use("/api/projects", projects);
};

module.exports = routerLoader;
