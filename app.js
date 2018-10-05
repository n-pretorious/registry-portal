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

const app = express();

// view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// body-parse mildware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));

//Set static path
app.use(express.static(path.join(__dirname, 'public')))

// home page get request
app.get('/', (req, res) => {
    res.render('index', {
        title : 'Home'
    });
});
// user registration get request.
app.get('/adduser', (req, res) => {
    res.render('createUser', {
        title : 'Register User'
    });
});

// list of users in the database get request.
app.get('/adduser/users', (req, res) => {
    dbUser.users.find(function(err, docs) {
        // console.log(docs);
        res.render('listuser', {
            title : 'List of users from DB',
            users : docs
        });
    });
});

// team registration get request.
app.get('/addteam', (req, res) => {
    res.render('createTeam', {
        title : 'Register Team'
    });
});

// list of users in the database get request.
app.get('/addteam/teams', (req, res) => {
    dbTeam.teams.find(function(err, docs) {
        // console.log(docs);
        res.render('listTeam', {
            title : 'List of users from DB',
            teams : docs
        });
    });
});

// user to team registration get request
app.get('/add-user-team', (req, res) => {
  res.render('addUserToTeam', {
    title : 'assign a user to a team'
  });
});

// list of teams and users
app.get('/add-user-team/team-user', (req, res) => {
  dbTeam_user.team_users.find( function (err, docs) {
    // console.log(docs);
    res.render('listTeamUser', {
      title : 'list of teams and users in each team',
      team_users : docs
    });
  });
});

// logs documents received at the reception
app.get('/logdoc', (req, res) => {
    res.render('logDoc', {
        title: 'Log documents here'
    });
});

// list of documents
app.get('/logdoc/list', (req, res) => {
  dbDoc.documents.find(function (err, docs){
    res.render('listDoc', {
      title : 'list of documents',
      documents : docs
    });
  })
});


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
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        // insert new users to database (registerUser.ejs)
        dbUser.users.insert(newUser, (err, result) => {
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
            team_no: req.body.team_no,
            team_name: req.body.team_name
        };
        // insert new teams to database (createTeam.ejs)
        dbTeam.teams.insert(newTeam, (err, result) => {
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
      dbTeam_user.team_users.insert(newUserToTeam, (err, result) => {
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
          date: req.body.date,
          time: req.body.time,
          type_of_documet: req.body.type_of_documet,
          parties_involved: req.body.parties_involved,
          case_no: req.body.case_no,
          drawn_by: req.body.drawn_by,
          team_no: req.body.team_no
      };
      // assign a new user to a team (addUserToTeam.ejs)
      dbDoc.documents.insert(newDoc, (err, result) => {
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
})
