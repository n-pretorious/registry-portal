const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongojs = require('mongojs');
const db = mongojs('registry')
const userCollection = db('users'); //variable to user table
const teamCollection = db('teams'); //variable to team table
const teamUsersCollection = db('team_users'); //variable to team/user table
const documentCollection = db('documents'); //variable to team/user table
const mailer = require('express-mailer');
const pushid = require('pushid')

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

// add a new user to the db
app.post('/adduser', [
    body('email')
    .isEmail()
    .normalizeEmail(),
    body('fname', 'lname')
    .not().isEmpty().withMessage('This field cannot be empty')
    .trim()
    .escape(),
    sanitizeBody('notifyOnReply').toBoolean(),
    // password must contain 8 characters and at least a number
    body('password')
    .isLength({
        min: 8
    }).withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number'),
    // checking if passwordConfirmation matches password
    body('passwordConfirmation')
    .custom((value, { req }) => value === req.body.password).withMessage('password confirmation does not match password'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    } else {
        let newUser = {
            userId: pushid(),
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        // insert new users to database (registerUser.ejs)
        userCollection.users.insert(newUser, (err, result) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/adduser/users');
        })
    }
});

// adds a new team to the db
app.post('/addteam', (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    } else {
        let newTeam = {
            team_id: pushid(),
            team_no: req.body.team_no,
            team_name: req.body.team_name
        };
        // insert new teams to database (createTeam.ejs)
        teamCollection.teams.insert(newTeam, (err, result) => {
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    errors: errors.array()
                });
            } else {
                res.redirect('/addteam/teams')
            }
        })
    }
});

//assigns a user to particular team
app.post('/add-user-team', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({
          errors: errors.array()
      });
  } else {
      let newUserToTeam = {
          teamID: req.body.teamID,
          userID: req.body.userID
      };
      // assign a new user to a team (addUserToTeam.ejs)
      teamUsersCollection.team_users.insert(newUserToTeam, (err, result) => {
          if (!errors.isEmpty()) {
              return res.status(422).json({
                  errors: errors.array()
              });
          } else {
              res.redirect('/add-user-team/team-user')
          }
      })
  }
});

//assigns a user to particular team
app.post('/logdoc', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({
          errors: errors.array()
      });
  } else {
      let newDoc = {
          document_id: pushid(),
          date: req.body.date,
          time: req.body.time,
          type_of_documet: req.body.type_of_documet,
          parties_involved: req.body.parties_involved,
          case_no: req.body.case_no,
          drawn_by: req.body.drawn_by,
          team_no: req.body.team_no,
      };
      // assign a new user to a team (addUserToTeam.ejs)
      documentCollection.documents.insert(newDoc, (err, result) => {
          if (!errors.isEmpty()) {
              return res.status(422).json({
                  errors: errors.array()
              });
          } else {
              res.redirect('/logdoc/list')
          }
      })
  }
});

// local host that the server runs on
app.listen(3000, () => {
    console.log('server running on port 3000');
});
