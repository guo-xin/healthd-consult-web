import Vue from 'vue';
import VueResource from 'vue-resource';
import store from 'store';
import global from './global';

function handleHttpError() {

}

function setToken(request) {
    let map = {
        user: '_userInfo',
        doctor: '_doctorInfo'
    };

    let config = global.getConfig();
    let role = config.role;

    if (config.accessFromApp) {
        if (config.ts && config.tk) {
            request.headers.append('ts', config.ts);
            request.headers.append('tk', config.tk);
        }
    } else {
        request.headers.append('t', (store.get(map[role]) || {}).accessToken || '');
    }

    //解决浏览器缓存问题
    request.headers.append('If-Modified-Since', '0');
    request.headers.append('Cache-Control', 'no-cache');
}

Vue.use(VueResource);

//拦截处理
Vue.http.interceptors.push((request, next) => {
    //修改url，统一配置访问地址
    let url = request.url;
    //let chronicdConfig = window.chronicdConfig || {};
    request.url = url.replace(/[/]?baseApi/, '/chronicd-server-api/v1');

    /*if (url.indexOf('baseApi') != -1) {
     request.url = url.replace(/[/]?baseApi/, (chronicdConfig.api || '') + 'v1');
     } else if (url.indexOf('consultApi') != -1) {
     request.url = url.replace(/[/]?consultApi/, (chronicdConfig.consultApi || '') + 'v1');
     }*/

    //统一添加登录认证token
    setToken(request);

    next((response) => {
        // modify response
        if (response.status.toString().startsWith('4') || response.status.toString().startsWith('5')) {
            handleHttpError(response.statusText, response);
            if (request.method == 'GET') {
                document.getElementById('no-internet').style.display = 'block';
            }
        }
    });
});

export default Vue.http;
