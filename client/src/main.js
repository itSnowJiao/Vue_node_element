import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入http加以使用
import axios from './http';
// 引入echarts
import echarts from 'echarts';

Vue.use(ElementUI);
Vue.config.productionTip = false;
// 注册axios以便全局使用
Vue.prototype.$axios = axios;
// 注册ecgarts全局使用
Vue.prototype.$echarts = echarts;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
