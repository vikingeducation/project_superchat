module.exports = {
  chatTable: messages => {
    var str = '';
    messages.forEach(message => {
      str +=
        '<tr><td><strong>' +
        message.author +
        ': </strong>' +
        message.body +
        '</td></tr>';
    });

    return str;
  }
};
