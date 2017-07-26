const router = require('express').Router();
const shortener = require('../shortener');

function route(io) {
  router.get('/', (req, res) => {
    // get all counts
    shortener
      .retrieve()
      .then(urls => {
        res.render('index', { urls: urls });
      })
      .catch(err => {
        console.error(err.stack);
        res.render('index');
      });
  });

  router.post('/', (req, res) => {
    // pull new url from body
    // initialize new id
    shortener
      .shorten(req.body.url)
      .then(urlObj => {
        io.emit('new', urlObj);
        res.redirect('/');
      })
      .catch(err => {
        console.error(err.stack);
        res.redirect('/');
      });
  });

  router.get('/s/:id', (req, res) => {
    console.log(req.params);
    // increment the counter
    shortener
      .update(req.params.id)
      .then(urlObj => {
        console.log(urlObj);
        // Update client pages
        io.emit('update', urlObj);
        // Redirect away!
        res.redirect(urlObj.originalUrl);
      })
      .catch(err => {
        // redirect home on error
        console.error(err.stack);
        res.redirect('/');
      });
  });

  return router;
}

module.exports = route;
