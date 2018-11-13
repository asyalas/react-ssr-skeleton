const Router = require('koa-router');
const LRUCache  = require( 'lru-cache');


const router = new Router();


router.renderNextRoute = (handle) => {
  //过滤掉api，其他的为服务端渲染
  const regex = /^(?!\/api)/;
  router.get(regex, async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });
};

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
});


router.ssrCache = (nextApp) => {

  /*
   * NB: make sure to modify this to take into account anything that should trigger
   * an immediate page change (e.g a locale stored in req.session)
   */
  function renderAndCache (ctx, pagePath, queryParams) {
    const key = ctx.req.url;

    // If we have a page in the cache, let's serve it
    if (ssrCache.has(key)) {
      console.log(`CACHE HIT: ${key}`);
      ctx.body = ssrCache.get(key);
      return Promise.resolve();
    }

    // If not let's render the page into HTML
    return nextApp.renderToHTML(ctx.req, ctx.res, pagePath, queryParams)
      .then((html) => {
        // Let's cache this page
        console.log(`CACHE MISS: ${key}`);
        ssrCache.set(key, html);
        ctx.body = html;
      })
      .catch((err) => {
        console.log('ERRR', err);
        return nextApp.renderError(err, ctx.req, ctx.res, pagePath, queryParams);
      });
  }

  router.get('/', (ctx) => renderAndCache(ctx, '/'));

  // preventing /blog from displaying
  // see https://github.com/zeit/next.js/issues/2682
  //router.get('/blog/:id', (ctx, id) => renderAndCache(ctx, '/blog2', { id }))
};

module.exports = router;
