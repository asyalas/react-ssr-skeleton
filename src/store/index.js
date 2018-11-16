import { action, observable } from 'mobx';
import { useStaticRendering } from 'mobx-react';
const isServer = typeof window === 'undefined';
useStaticRendering(isServer);
class Store {
  @observable num = 0;

  constructor () {
  }
  @action setState = (key, value) => this[key] = value

  //同步
  @action add=() => ++this.num
  
  //delay 2 s
  delay = () => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });

  //异步
  @action asyncAdd= async() => {
    await this.delay();
    this.setState('num', ++this.num);
  }
}

let store = null;
export function initializeStore (initialData) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return new Store(isServer, initialData);
  }
  if (store === null) {
    store = new Store(isServer, initialData);
  }
  return store;
}
