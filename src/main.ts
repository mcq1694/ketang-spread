import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import App from './App.vue';
/* #ifdef H5 */
import 'normalize.css';
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line new-cap
  import('vconsole').then((module) => new module.default());
}
/* #endif */
// #ifdef H5-DEVELOP
// if (process.env.NODE_ENV !== 'development') {

//   import('vconsole').then((module) => new module.default());
// }
// #endif

export function createApp() {
  const app = createSSRApp(App);
  // setupStore(app);
  app.use(Pinia.createPinia());
  return {
    app,
    Pinia,
  };
}
