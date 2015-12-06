const express  = require('express');
const bodyParser = require('body-parser');
const logger   = require('morgan');
const bunyan   = require('bunyan');
const sessions = require('client-sessions');
const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy;

const log = bunyan.createLogger({ name: 'express-template' });

createApp = () => {
  const app = express();

  const loggerStream  = {
    write: (msg, encoding) => {
      log.info(msg)
    }
  }

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms', {
    stream: loggerStream
  }));

  // 2 hour encrypted session
  app.use(sessions({
    cookieName: 'session',
    secret: 'foobar', // Change this
    duration: 2 * 60 * 60 * 1000
  }));

  app.use(passport.initialize());

  passport.use(new LocalStrategy((username, password, done) => {
    if (username !== 'Matti' || password !== 'salasana1') {
      log.warn('login failed')
      done(null, false, { message: 'Incorrect username or password.' });
    } else {
      done(null, {username: 'Matti', age: '48'});
    }
  }));

  app.post('/api/login', passport.authenticate('local', { session: false }),
    (req, res) => {
      req.session.username = req.user.username;
      res.sendStatus(201);
  });

  app.get('/api/login', (req, res) => {
    req.session.username = 'Matti';
    res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
  });

  app.get('/', (req, res) => {
    if (req.session.username) {
      res.send('Hello ' + req.session.username + '<br/><a href="/api/logout">logout</a>')
    } else {
      res.send('<a href="/api/login">login</a>')
    }
  });
  return app;
}

startApp = (app) => {
  const server = app.listen(3000, () => {
    const host = server.address().address;
    const port = server.address().port;
    log.info('Express app listening at port %s', port);
  });
}

start = () =>
  startApp(createApp());

stop = () => {
  // close handles here
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

exports.start     = start;
exports.stop      = stop;
exports.createApp = createApp;
