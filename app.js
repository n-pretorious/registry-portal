const express = require ('express');
const bodyParser = require ('body-parser');
const path = require ('path');
const { body, validationResult } = require ('express-validator/check');
const { sanitizeBody } = require ('express-validator/filter');
const mongojs = require('mongojs');
const db = mongojs('registry', ['users']);

const app = express();

// view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// body-parse mildware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

//Set static path
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  db.users.find(function (err, docs) {
    // console.log(docs);
    res.render('index',{
      title : 'Registration form',
      users : docs
    });
  });
});

app.post('/signup', [
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
      password: req.body.password,
      passwordConfirmation : req.body.passwordConfirmation
    };
    // insert users from the signup form
    db.users.insert(newUser, function (err, result) {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    })
  }
});

// local host that the server runs on
app.listen(3000, () => {
  console.log('server running on port 3000');
})
