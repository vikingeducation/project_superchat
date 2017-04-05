let injectedRoute = io => {
  const express = require("express");
  //const router = express.Router();
  const router = express.Router();
  const chatOps = require("../lib/chatOps");

  router.get("/", (req, res) => {
    let user = req.cookies.user;
    if (user) {
      res.render("chat");
    } else {
      res.render("index");
    }
  });

  router.post("/", (req, res) => {
    let username = req.body.username;
    res.cookie("user", username);
    res.redirect("/");
  });

  return router;
};

module.exports = injectedRoute;
