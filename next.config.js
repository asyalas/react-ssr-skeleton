
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const {  WebpackBundleSizeAnalyzerPlugin } = require('webpack-bundle-size-analyzer');

const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const paths =  require('./paths.js');
const { ANALYZE } = process.env;
/**
 * 使函数的调用柯里化
 * next.config本质其实是对webpack config进行一次对象合并
 */
const fn = fn => (a = {}) => (b = {}) => fn(Object.assign({}, a, b));


/**
 * cssModules配置
 */
const cssModules = {
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]"
  }
};
/**
 * 添加分析webpack bundles的插件
 */
const addAnalyzePlugin = (ANALYZE, config) => {
  switch (ANALYZE) {
    case 'BUNDLES':
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true
        }),
      );
      break;
    case 'SIZE':
      config.plugins.push(new WebpackBundleSizeAnalyzerPlugin('stats.txt'));
      break;
  }
}; 
/**
 * 添加eslint
 */

const addEslintPlugin = config => {
  config.module.rules.push({
    test: /\.(jsx|tsx)$/,
    enforce: "pre",
    loader: "eslint-loader",
    exclude: ['/node_modules/', '/build/'],
    options: {
      formatter: require('eslint-friendly-formatter'),
      emitError: true
    }
  });
};


/***
 * webpack原始的配置
 */
const webpackConfig = {
  webpack:  (config, { buildId, dev, isServer, defaultLoaders })  => {
    //添加分析插件
    if (ANALYZE)  {
      addAnalyzePlugin(ANALYZE, config);
    }
    //添加eslint
    addEslintPlugin(config);

    //自定义webpack的resolve
    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.jsx', 'ts', 'tsx', '.json', '.png'],
      alias:paths.alias
    };
    //在开发环境下默认打开浏览器
    if (dev) {
      
      // config.plugins.push(new OpenBrowserPlugin({ }));
    }
    
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    };
    return config;
  }
};

/**
 * 提供sass-loader
 * 打开cssModules
 */
const withSass = fn(require('@zeit/next-sass'))(cssModules);

/**
 * 配置cssLoader
 * postcssLoader通过postcss.config.js配置
 * 打开cssModules
 */
const withCss = fn(require('@zeit/next-css'))(cssModules);

/**
 * 配置typescript
 * 
 */

const withTypescript = fn(require('@zeit/next-typescript'))();

module.exports = withTypescript(withCss(withSass(webpackConfig)));
