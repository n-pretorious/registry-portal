const express = require ('express');
const bodyParser = require ('body-parser');
const path = require ('path');
const { body, validationResult } = require ('express-validator/check');
const { sanitizeBody } = require ('express-validator/filter');
const mongojs = require('mongojs');
const dbUser = mongojs('registry', ['users']); //variable to user table
const dbTeam = mongojs('registry', ['teams']); //variable to team table

const app = express();

// view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// body-parse mildware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

//Set static path
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (res, req) => {
  res.render('index', {
    title : 'Home'
  })
})
// user registration get request.
app.get('/adduser', (req, res) => {
    res.render('createUser', {
      title : 'Register User'
    });
});

// list of users in the database get request.
app.get('/adduser/users', (req, res) => {
  dbUser.users.find(function (err, docs) {
    // console.log(docs);
    res.render('listuser',{
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
  dbTeam.teams.find(function (err, docs) {
    // console.log(docs);
    res.render('listTeam',{
      title : 'List of users from DB',
      teams : docs
    });
  });
});


// add a new user to the db
// remember to put the auth in a diff file lin2 67-83
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
    .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
    .matches(/\d/).withMessage('must contain a number'),
    // checking if passwordConfirmation matches password
  body('passwordConfirmation')
    .custom((value, { req }) => value === req.body.password)
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let newUser = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      phoneNo: req.body.phoneNo,
      password: req.body.password,
      passwordConfirmation : req.body.passwordConfirmation
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

app.post('/addteam', (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    let newTeam = {
      team_no: req.body.team_no,
      team_name: req.body.team_name
    };
    // insert new teams to database (createTeam.ejs)
    dbTeam.teams.insert(newTeam, (err, result) =>{
      if (!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
      } else {
        res.redirect ('/addteam/teams')
      }
    })
  }
});
// get a resquest of list from the database


// local host that the server runs on
app.listen(3000, () => {
  console.log('server running on port 3000');
})
