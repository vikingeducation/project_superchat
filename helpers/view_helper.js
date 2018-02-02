const Handlebars = require('handlebars');

var viewHelper = {};

const getFormattedTime = (d) => {
  var hours = d.getUTCHours();
  var minutes = d.getUTCMinutes();

  // 0 padding for minutes under 10
  if (minutes < 10) { minutes = `0${minutes}`; }

  if (hours > 12) {
    return `${ hours - 12 }:${minutes}pm UTC`;
  } else {
    return `${ hours }:${minutes}am UTC`;
  }
};

viewHelper.formatDate = (d) => {
  d = new Date(d);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${getFormattedTime(d)}`;
};

viewHelper.addHr = (messages, message) => {
  if (messages[0] !== message) return new Handlebars.SafeString('<hr>');
};

module.exports = viewHelper;
