const data = require('./services/chatData.js');
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
let serverSocket;

app.use(
    "/socket.io",
    express.static(__dirname + "node_modules/socket.io-client/dist/")
);


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
            console.log(element);
            messagesArr.push(JSON.parse(element));
        });

        console.log(messagesArr);
        res.render('index', {"messagesArr": messagesArr});

    })

    .catch((reject) => {
        console.log(reject);
    });
});


io.on('connection', client => {

    client.on('addMsg', (msgProfile) => {
        console.log(msgProfile);
        data.storeMessages('test', msgProfile);
        
        io.emit('updateClient', msgProfile);

    });

});

server.listen(3000);