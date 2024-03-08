const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const expressLoader = async (app) => {
  const PORT = process.env.PORT || 3001;

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

module.exports = expressLoader;
