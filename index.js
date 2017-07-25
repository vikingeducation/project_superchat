const data = require('./services/chatData.js');
const express = require('express');
const app = express();


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

    data.getMessages('Test')
    .then (messages => {
        messages.map(element => { console.log(element)});
    });

    console.log('hello');
    res.render('index');
});

app.listen(3000);