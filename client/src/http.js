import axios from 'axios';
import { Loading,Message } from 'element-ui';
import router from './router';


let loading;
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '拼命加载中。。。。',
        background: 'rgba(0,0,0,0.5)'
    })
};
function endLoading() {
    loading.close()
};
// 请求拦截
axios.interceptors.request.use(config => {
    // 加载动画
    startLoading();


    // 判断token是否存在
    if (localStorage.eleToken) {
        // 设置统一的请求Header
        config.headers.Authorization = localStorage.eleToken;
    };
    // 返回配置
    return config;
},error => {
    return Promise.reject(error)
});
// 响应拦截
axios.interceptors.response.use(response => {
    // 结束动画
    endLoading();
    return response;
},error => {
    // 错误提醒
    endLoading();
    Message.error(error.response.data);

    // 获取错误状态码
    const {status} = error.response;
    if(status ==401) {
        // 信息提示
        Message.error('token失效，请重新登录！');
        // 清除token
        localStorage.removeItem('eleToken');
        // 跳转到login页面
        router.push('/login');
    }

    // 返回错误
    return Promise.reject(error)
});

export default axios;