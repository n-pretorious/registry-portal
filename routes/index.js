const express = require ('express')
const router = express.Router()
const sanitizerEmail = require('./controls/auth.js')


router.get('/', (req, res) => {res.render('index', {title : 'Home'}) })

router.get('/adduser', (req, res) => {res.render('createUser', {title : 'Register User'}) })
router.get('/adduser/users', (req, res) => {dbUser.users.find(function(err, docs) {res.render('listuser', {title : 'List of users from DB', users : docs}) }) })

router.get('/addteam', (req, res) => {res.render('createTeam', {title : 'Register Team' }) })
router.get('/addteam/teams', (req, res) => {dbTeam.teams.find(function(err, docs) {res.render('listTeam', {title : 'List of users from DB', teams : docs }) }) })

router.get('/add-user-team', (req, res) => {res.render('addUserToTeam', {title : 'assign a user to a team'}) });
router.get('/add-user-team/team-user', (req, res) => {dbTeam_user.team_users.find( function (err, docs) {res.render('listTeamUser', {title : 'list of teams and users in each team', team_users : docs})})});

router.get('/logdoc', (req, res) => {res.render('logDoc', {title: 'Log documents here'}) })
router.get('/logdoc/list', (req, res) => {dbDoc.documents.find(function (err, docs){res.render('listDoc', {title : 'list of documents', documents : docs    })})})

// add a new user to the db
router.post('/adduser', sanitizerEmail , (req, res) => {
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
router.post('/addteam', (req, res) => {
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
router.post('/add-user-team', (req, res) => {
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
router.post('/logdoc', (req, res) => {
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
          team_no: req.body.team_no,
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

module.exports = router
