const express = require('express');
const logger = require('morgan');
const bunyan = require('bunyan');

const app = express();
const log = bunyan.createLogger({name: 'express-template'});

const loggerStream  = {
  write: (msg, encoding) => {
    log.info(msg)
  }
}

app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms', {
  stream: loggerStream
}));

app.get('/', (req, res) =>
  res.send('Hello World!')
);

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;
  log.info('Express app listening at port %s', port);
});
