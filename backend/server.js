const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./model/User');
const token = require('./twilio-token');
const cookieParser = require('cookie-parser');

mongoose.connect('mongodb://localhost/ReelLecture',
  { useNewUrlParser: true, useUnifiedTopology: true });

const username = "admin"
const password = "admin"

User.findOneAndDelete({ username }, async (err, res) => {
  let user = new User({ username });
  await user.setPassword(password);
  await user.save()
});

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(cookieParser());

const apiRouter = express.Router()
app.use('/api', apiRouter);

apiRouter.get('/', (req, res) => {
  res.send({ api: 'active', loggedIn: req.isAuthenticated() });
});
apiRouter.post('/login', passport.authenticate('local', { successRedirect: '/user' }));

apiRouter.use((req, res, next) => {
  if (req.isAuthenticated())
    next();
  else {
    res.status(401).send("Blocked route, please login first.");
  }
});

apiRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login')
});

apiRouter.get('/token', (req, res) => {
  res.send({ jwt: token(req.user.username) });
});

app.get('*', (req, res) => res.sendFile(path.resolve('public', 'index.html')));
app.listen(8080, () => console.log("Listening on port 8080"));