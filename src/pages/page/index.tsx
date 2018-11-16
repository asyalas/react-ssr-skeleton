/** 
 * 提供两个有功能的基础类
 * 通过创建./pages/_app.js文件，重写 App 模块
 */
// 动态注入组件
// import dynamic from 'next/dynamic';
import Head from 'components/head';
import Nav from 'components/nav';
import { inject, observer } from 'mobx-react';
import { Container } from 'next/app';
import React from 'react';

@inject('store')
@observer
class Page extends React.Component {
  static async getInitialProps(context: any) {
    return {
      store1 : context.ctx
    };
  }
  render() {
    return (
      <Container>
        <Head title="Page" />
        <Nav />

        <div>2222</div>

      </Container>
    );
  }
}
export default Page;
