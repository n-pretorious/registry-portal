const express = require ('express')
const router = express.Router()

router.get('/', (req, res) => {res.render('index', {title : 'Home'}) })
router.get('/adduser', (req, res) => {res.render('createUser', {title : 'Register User'}) })
router.get('/adduser/users', (req, res) => {dbUser.users.find(function(err, docs) {res.render('listuser', {title : 'List of users from DB', users : docs}) }) })
router.get('/addteam', (req, res) => {res.render('createTeam', {title : 'Register Team' }) })
router.get('/addteam/teams', (req, res) => {dbTeam.teams.find(function(err, docs) {res.render('listTeam', {title : 'List of users from DB', teams : docs }) }) })
router.get('/add-user-team', (req, res) => {res.render('addUserToTeam', {title : 'assign a user to a team'}) });
router.get('/add-user-team/team-user', (req, res) => {dbTeam_user.team_users.find( function (err, docs) {res.render('listTeamUser', {title : 'list of teams and users in each team', team_users : docs})})});
router.get('/logdoc', (req, res) => {res.render('logDoc', {title: 'Log documents here'}) })
router.get('/logdoc/list', (req, res) => {dbDoc.documents.find(function (err, docs){res.render('listDoc', {title : 'list of documents', documents : docs    })})})

module.exports = router
