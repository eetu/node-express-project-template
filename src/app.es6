const express  = require('express');
const logger   = require('morgan');
const bunyan   = require('bunyan');
const sessions = require('client-sessions');

const log = bunyan.createLogger({name: 'express-template'});

createApp = () => {
  const app = express();

  const loggerStream  = {
    write: (msg, encoding) => {
      log.info(msg)
    }
  }

  app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms', {
    stream: loggerStream
  }));

  // 2 hour encrypted session
  app.use(sessions({
    cookieName: 'session',
    secret: 'foobar', // Change this
    duration: 2 * 60 * 60 * 1000
  }));

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
