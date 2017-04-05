const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");

  // let user = req.cookie.user;
  // if (user) {
  //   res.render("chat");
  // } else {
  //   res.render("index");
  // }
});

module.exports = router;
