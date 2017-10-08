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
    
    //check if cookie of "user" exists or not. Should check if user is already taken or not in redis
    if (Object.keys(req.user).length === 0 && req.user.constructor === Object) {
        console.log("Not logged in");
        res.redirect('/login');
    }

    else {
        let messagesArr = [];
        let rooms = [];
        
        data.getRooms()

            .then(roomNames => {
                rooms = roomNames;
           

                res.render('index', {"rooms": rooms, "userName": req.user});

            })

            .catch((reject) => {
                console.log(reject);
            });
    }
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login', (req, res) => {
    res.cookie("user", req.body.userLogin);

    res.redirect("/");
});

app.post('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/login');

});

io.on('connection', client => {

    client.on('addMsg', (msgProfile) => {

        data.storeMessages(msgProfile.roomName, msgProfile.author, msgProfile.body);

        io.emit('updateClient', msgProfile);

    });

    client.on('addRoom', (roomName) => {
        data.storeRooms(roomName);
        console.log(roomName);
        io.emit('updateRoomList', roomName);
    });

    client.on('changeRoom', val => {
        let messagesArr = [];
        data.getMessages(val)

            .then(messages => {
                
                messages.map(element => {
                    messagesArr.push(JSON.parse(element)); //parse each element into json and hold each json in array
                });

                client.emit('roomChanged', messagesArr);
            })
            
            .catch(reject => {
                console.log(reject);
            });
    });

});



server.listen(4000);