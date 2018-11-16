const Koa  = require('koa');

const server  = require('koa-static');
const log = require('./utils/log');
const tcp = require('./utils/tcp');
const paths = require('../config/paths');
const app = new Koa();
app.use(server(paths.dist));
app.listen(tcp.distPort, tcp.host, () => {
  log.info(`API server listening on http://${tcp.host}:${tcp.distPort}, in dist`);
});