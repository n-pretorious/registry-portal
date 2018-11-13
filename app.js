const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongojs = require('mongojs');
const dbUser = mongojs('registry', ['users']); //variable to user table
const dbTeam = mongojs('registry', ['teams']); //variable to team table
const dbTeam_user = mongojs('registry', ['team_users']); //variable to team/user table
const dbDoc = mongojs('registry', ['documents']); //variable to team/user table
const mailer = require('express-mailer');

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
});
