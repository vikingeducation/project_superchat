const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let user = req.cookies.user;
  if (user) {
    res.render("chat");
  } else {
    res.render("index");
  }
});


router.post('/', (req, res) => {
  let username = req.body.username;
  res.cookie('user', username);
  res.redirect('/');
});


module.exports = router;
