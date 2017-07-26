const shortid = require('shortid').generate;
const redis = require('./redis_wrapper');
const env = require('../../env');

let shortener = {
  // Add a given url to the redis store
  // return promises that resolve to the url and count objects
  shorten: function(url) {
    // Create id
    let id = shortid();
    // Insert url and count into hashes
    return new Promise((resolve, reject) => {
      Promise.all([redis.set('counts', id, 0), redis.set('urls', id, url)])
        .then(([countObj, urlObj]) => {
          resolve(_buildIds(countObj, urlObj)[0]);
        })
        .catch(err => reject(err));
    });
  },

  // Increment the count for a given id,
  // Return a promise that resolve to its url object
  update: function(id) {
    return new Promise((resolve, reject) => {
      Promise.all([redis.incr('counts', id), redis.get('urls', id)])
        .then(([countObj, urlObj]) => {
          resolve(_buildIds(countObj, urlObj)[0]);
        })
        .catch(err => reject(err));
    });
  },

  // Return a promise that resolves to a list of url objects
  retrieve: function() {
    return new Promise((resolve, reject) => {
      // Get our (ids), counts, and urls
      Promise.all([redis.getAll('counts'), redis.getAll('urls')])
        .then(([countsObj, urlsObj]) => {
          // Build and pass our list of objects
          resolve(_buildIds(countsObj, urlsObj));
        })
        .catch(err => reject(err));
    });
  }
};

// Return an array of id objects given counts and urls objects
function _buildIds(countsObj, urlsObj) {
  let urls = [];
  for (let id in countsObj) {
    // Qualify our local links
    let qualified = `http://${env.hostname}:${env.port}/s/${id}`;
    urls.push({
      url: qualified,
      count: countsObj[id],
      originalUrl: urlsObj[id],
      id: id
    });
  }
  return urls;
}

module.exports = shortener;
