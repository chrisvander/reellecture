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
const multer  = require('multer');
const upload = multer()
const app = express();

const imageRequest = require('./aws');

mongoose.connect('mongodb://localhost/ReelLecture',
  { useNewUrlParser: true, useUnifiedTopology: true });



// let student = 'student';
// let password = 'password';
// let s = new User({ username: 'sabhya@gmail.com', name: 'Sabhya', role: student });
// s.setPassword(password).then(() => s.save());

// let c = new User({ username: 'chris@gmail.com', name: 'Chris', role: 'instructor' });
// c.setPassword(password).then(() => c.save());

// let a = new User({ username: 'alex@gmail.com', name: 'Alex', role: 'instructor' });
// a.setPassword(password).then(() => a.save());

// let am = new User({ username: 'amanda@gmail.com', name: 'Amanda', role: student });
// am.setPassword(password).then(() => am.save());

User.find({ }).exec((err, docs) => console.log(docs))

app.get('/', (req, res) => res.sendFile(path.resolve('public', 'home.html')));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

let analytics = {
  eyesClosed: {},
  happy: {},
  sad: {},
  angry: {},
  confused: {},
  disgusted: {},
  surprised: {},
  calm: {},
  fear: {},
  absent: {}
}

calcValues = (data, name) => {
  data.FaceDetails.forEach(element => {
    if (element.length == 0) {
      if (analytics['absent'][name]) analytics['absent'][name] += 1; 
      else analytics['absent'][name] = 1; 
    }
    if (!element.EyesOpen.Value) {
      if (analytics['eyesClosed'][name]) analytics['eyesClosed'][name] += 1; 
      else analytics['eyesClosed'][name] = 1; 
    }
    let max = 0.0; 
    let topEmotion = "";
    element.Emotions.forEach(emotion => {
      if (emotion.Confidence > max) {
        topEmotion = emotion.Type; 
        max = emotion.Confidence; 
      }
    })
    if (analytics[topEmotion] === undefined) analytics[topEmotion] = {};
    if (analytics[topEmotion][name] === undefined) {
      analytics[topEmotion][name] = 0
    }
    analytics[topEmotion][name] += 1;  
  }); 
  // data.FaceDetails.forEach(element => console.log(element)); 
}; 

apiRouter.post('/register', async (req, res) => {
  let newUser = new User({ 
    name: req.body.name, 
    username: req.body.email,
    role: req.body.role 
  });
  await newUser.setPassword(req.body.password);
  let doc = await newUser.save();
  res.send(doc);
});

apiRouter.post('/login', passport.authenticate('local', { 
  successRedirect: '/user', 
  failureRedirect: '/login' 
}));

apiRouter.get('/logout', (req, res) => {
  req.logout();
  res.send("success");
});

apiRouter.use((req, res, next) => {
  if (req.isAuthenticated())
    next();
  else {
    res.status(401).send("Blocked route, please login first.");
  }
});

apiRouter.get('/analytics/stream',  (req, res) => {
  if (req.user.role !== 'instructor') res.status(401).send("Unauthorized, instructor route");
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  // Tell the client to retry every 10 seconds if connectivity is lost
  res.write('retry: 1000\n\n');

  let timeout = setInterval(() => {
    console.log("STREAMING")
    const id = 3434
    res.write(`data:This is event ${id}.`);
    res.write('\n\n');
  }, 1000);

  res.on("close", () => {
    clearInterval(timeout);
    res.end();
  });
});

apiRouter.get('/analytics',  (req, res) => {
  if (req.user.role !== 'instructor') res.status(401).send("Unauthorized, instructor route");
  res.send(analytics);
});

apiRouter.post('/photo', upload.single('photo'), (req, res) => {
  imageRequest(req.file.buffer, data => {
    console.log(data)
    res.send(data); 
    calcValues(data, req.user.name); 
  });
});

apiRouter.get('/user', (req, res) => {
  let { username, name, role } = req.user;
  res.send({ username, name, role });
});

apiRouter.get('/token/:id', (req, res) => {
  res.send({ jwt: token(req.user.username, req.params.id) });
});


app.get('*', (req, res) => res.sendFile(path.resolve('public', 'index.html')));
const server = app.listen(8080, () => console.log("Listening on port 8080"));
// server.on('upgrade', (request, socket, head) => {
//   socketServer.handleUpgrade(request, socket, head, socket => {
//     socketServer.emit('connection', socket, request);
//   });
// });