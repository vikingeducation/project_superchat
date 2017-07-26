const data = require('./services/chatData.js');
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
let serverSocket;

//set up handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    partialsDir: 'views/'
}));
app.set('view engine', 'handlebars');

//setup style css
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    let messagesArr = [];

    data.getMessages('test')

    .then (messages => {
        messages.map(element => {
            messagesArr.push(JSON.parse(element));
        });

        res.render('index', {"messagesArr": messagesArr});

    })

    .catch((reject) => {
        console.log(reject);
    });
});


io.on('connection', client => {

    client.on('addMsg', (msgProfile) => {
        data.storeMessages(msgProfile.msg, msgProfile.author);
    });

});

app.listen(3000);