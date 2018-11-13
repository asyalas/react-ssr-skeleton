
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const {  WebpackBundleSizeAnalyzerPlugin } = require('webpack-bundle-size-analyzer');

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

const addEslintRule = config => {
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

/**
 * 添加对静态资源的处理
 * url-loader file-loader
 */
const addStaticRule = config => {
  config.module.rules.unshift({
    test: /\.(png|jpg|svg|eot|otf|ico|ttf|woff|woff2)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 20000,
        name: '../static/[name].[hash:8].[ext]'
      }
    }
  });
  config.module.rules.push({
    loader: require.resolve('file-loader'),
    // Exclude `js` files to keep "css" loader working as it injects
    // it's runtime that would otherwise processed through "file" loader.
    // Also exclude `html` and `json` extensions so they get processed
    // by webpacks internal loaders.
    exclude: [/\.(js|jsx|ts|tsx|mjs|css|scss)$/, /\.(png|jpg|svg|eot|otf|ico|ttf|woff|woff2)$/, /\.html$/, /\.json$/],
    options: {
      name: '../static/[name].[hash:8].[ext]'
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
    addEslintRule(config);
    //添加对静态资源的处理
    addStaticRule(config);

    //自定义webpack的resolve
    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.jsx', 'ts', 'tsx', '.json', '.png'],
      alias:paths.alias
    };
    
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    };

    console.log('=======================');
    console.log(config.module.rules);

    console.log('=======================');
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
 */

const withTypescript = fn(require('@zeit/next-typescript'))();




module.exports = withTypescript(withCss(withSass(webpackConfig)));
