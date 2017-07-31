const data = require('./services/chatData.js');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const userMiddleware = require('./services/custom_middleware/user');
let serverSocket;

app.use(
    "/socket.io",
    express.static(__dirname + "node_modules/socket.io-client/dist/")
);

//set up body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//set up cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//set up handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    partialsDir: 'views/'
}));
app.set('view engine', 'handlebars');

//setup style css
app.use(express.static(__dirname + '/public'));

app.use(userMiddleware);

app.get('/', (req, res) => {

    if (Object.keys(req.user).length === 0 && req.user.constructor === Object) {
        console.log("Not logged in");
        res.redirect('/login');
    }

    else {
        let messagesArr = [];

        data.getMessages('test')

            .then(messages => {
                messages.map(element => {
                    console.log(element);
                    messagesArr.push(JSON.parse(element));
                });

                console.log(messagesArr);
                res.render('index', { "messagesArr": messagesArr });

            })

            .catch((reject) => {
                console.log(reject);
            });
    }
});

app.get('/login', (req,res)=> {
    res.render("login");
});

app.post('/login', (req,res) => {
    res.cookie("user", req.body.userLogin);

    res.redirect("back");
})

io.on('connection', client => {

    client.on('addMsg', (msgProfile) => {
        console.log(msgProfile);

        //pass the name of the user here to store message. 
        data.storeMessages('test', msgProfile);

        io.emit('updateClient', msgProfile);

    });

});

server.listen(3000);