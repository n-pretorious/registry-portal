const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const routes = require('./routes/index')

const app = express();

// view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//initialize the route handling
//check .routes/index.js to get a list of all routes
app.use('/', routes);  

// local host that the server runs on
app.listen(3000, () => {
    console.log('server running on port 3000');
})
