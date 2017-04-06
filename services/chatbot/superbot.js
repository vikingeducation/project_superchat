const {responses, responseRandomizer} = require("./responses")

function checkSuperbot(message) {
  if (message.match(/super/)) {
    return responseRandomizer(responses.super);
  } else if (message.match(/pizza/)) {
    return responseRandomizer(responses.pizza);
  }else {
    return undefined
  }
} 

module.exports = checkSuperbot


