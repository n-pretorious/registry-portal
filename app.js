const express = require ('express');
const bodyParser = require ('body-parser');
const path = require ('path');
const { body } = require ('express-validator/check');
const { sanitizeBody } = require ('express-validator/filter');

const app = express();

// view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// body-parse mildware
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json())

app.post( '/users/add', (req, res) => {

});

//Set static path 
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req,res) => {
  res.render('index',{
      title : 'Registration form'
  });
});

app.post('/users/add', [
  body('email')
    .isEmail()
    .not().isEmpty()
    .normalizeEmail(),
  body('text')
    .not().isEmpty(),
  sanitizeBody('notifyOnReply').toBoolean(),
  body('password')
    .not().isEmpty()
    .isLength({ min: 8 }).withMessage('must be at least 5 chars long')
    .matches(/\d/).withMessage('must contain a number'),
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
  }),
  ], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.create({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,    
    password: req.body.lname,
    passwordConfirmation : req.body.passwordConfirmation
    
  }).then(user => res.json(user));

  console.log(user);
  res.render('home',{
      userValue : user,
      title : 'Registration form'
  });
   
});

app.listen(5000, () =>{
  console.log('server running on port 5000');
})