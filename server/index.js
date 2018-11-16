const Koa  = require('koa');

//引入koa中间件
const  bodyParser  = require( 'koa-bodyparser');
const  helmet = require( 'koa-helmet');
const logger = require( 'koa-logger');
const requestId = require( 'koa-requestid');
const cors = require( 'kcors');
const router  = require( './routes');

//引入next相关文件
const next = require( 'next');
const conf = require( '../config/next.config');

//引入工具类
const getPort = require( 'get-port');
const log = require('./utils/log');
const tcp = require('./utils/tcp');
// const utils = require('./utils');

/**
 * 获取当前环境
 */
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const dev = process.env.NODE_ENV !== 'production';

/**
 * 初始化next
 */
const nextApp = next({
  dev,
  conf,
  dir: './src'
});

const handle = nextApp.getRequestHandler();

/**
 * 劫持所有的请求
 * 对页面进行一定的缓存，来提高性能
 */
router.ssrCache(nextApp);
/**
 * 过滤接口，渲染页面
 * 对请求的url进行判断
 */
router.renderNextRoute(handle);

/**
 * 初始化koa并设置中间件
 */
const app = new Koa();
!dev ? app.use(logger()) : '';
app.use(bodyParser());
app.use(requestId());
app.use(helmet());
app.use(cors({
  exposeHeaders: ['X-Request-Id']
}));

nextApp.prepare()
  .then(() => {
    //插入koa-router
    app.use(router.routes());
    app.use(router.allowedMethods());
    //检查数组里的端口是否可用，如果都不可用，则随机分配一个可用的端口
    (async () => {
      const port = tcp.port;
      const tcpPort = await getPort({port:port});
      app.listen(tcpPort, tcp.host, () => {
        log.info(`API server listening on http://${tcp.host}:${tcpPort}, in ${env}`);
      });
    })();
  });

app.on('error', err => log.error(`Unhandled exception occured. message: ${err.message}`));