import Link from 'next/link';
import React from 'react';

/** 
 * 提供两个有功能的基础类
 * 通过创建./pages/_app.js文件，重写 App 模块
 */
import { Container } from 'next/app';
import Css from './index.css';
import Styles from './index.scss';

// 动态注入组件
// import dynamic from 'next/dynamic';
import Head from 'components/head';
import Nav from 'components/nav';

export default  class Home extends React.Component {
  /**
   * getInitialProps
   * 当页面初次加载时，getInitialProps只会在服务端执行一次。
   * getInitialProps只有在路由切换的时候（如Link组件跳转或路由自定义跳转）时，客户端的才会被执行。
   * 在使用next export导出的时候，因为不在node的上下文，也不再window的上下文中，所以node和window下的对象属性不能使用
   * @param {object} params 可以从获取res,req,pathname,query,asPath等对象
   * @return {object} 返回一个对象，在this.props中获取
   */
  static async getInitialProps() {
    return {};
  }
  render() {
    return (
      <Container>
        <Head title="Home" />
        <Nav />
    
        <div className={Styles.hero}>
          <h1 className={Styles.title}>Welcome to Next!</h1>
          <img src="/static/img/background-min.png"/>
          <p className={Styles.description} >
            To get started, edit <code>pages/index.js</code> and save to reload.
          </p>
    
          <div className={Styles.row} >
            {
              /**
               * 预加载页面
               * Next.js 的预加载功能只预加载 JS 代码。当页面渲染时，你可能需要等待数据请求。
               * 方法一 给<Link>添加 prefetch 属性
               * 方法二 router.prefetch('/dynamic')},建议写在componentDidMount里面
               */
            }
            <Link prefetch={true} href="https://github.com/zeit/next.js#getting-started">
              <a className={Css.card} >
                <h3>Getting Started &rarr;</h3>
                <p>Learn more about Next on Github and in their examples</p>
              </a>
            </Link>
            <Link href="https://open.segment.com/create-next-app">
              <a className={Css.card}>
                <h3>Examples &rarr;</h3>
                <p>
                  Find other example boilerplates on the{' '}
                  <code>create-next-app</code> site
                </p>
              </a>
            </Link>
            <Link href="https://github.com/segmentio/create-next-app">
              <a className={Css.card}>
                <h3>Create Next App &rarr;</h3>
                <p>Was this tool helpful? Let us know how we can improve it</p>
              </a>
            </Link>
          </div>
        </div>
    
      </Container>
    );
  }
}
