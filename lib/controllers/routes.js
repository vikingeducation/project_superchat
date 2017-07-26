const router = require('express').Router();

router.get('/', (req, res) => {
  // later we're gonna check if they're logged in first and redirect to
  // the login
  res.render('index');
});

module.exports = router;
