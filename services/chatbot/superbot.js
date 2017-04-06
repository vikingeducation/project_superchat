const superbotResponses = [
  "I think you're super!",
  "Thats 'SUPER' hehehehe",
  "I could do better!"
];

function responseRandomizer() {
  var response = superbotResponses[Math.floor(Math.random()*superbotResponses.length)];
  return response;
}

function checkSuperbot(message) {
  if (message.match(/super/)) {
    return responseRandomizer();
  } else {
    return undefined
  }
} 

module.exports = checkSuperbot


