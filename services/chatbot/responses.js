function responseRandomizer(array) {
  var response = array[Math.floor(Math.random()*array.length)];
  return response;
}

let responses = {
  super: [
    "I think you're super!",
    "Thats 'SUPER' hehehehe",
    "I could do better!"
  ],
  pizza: [
    "Pizza is something I enjoy",
    "The saucier the better!",
    "Dogs LOVE pizza!"
  ]
}

module.exports = {
  responses, 
  responseRandomizer
}