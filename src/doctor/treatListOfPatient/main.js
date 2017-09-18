import Vue from 'vue';
import App from './App.vue';
import {InfiniteScroll, Spinner} from 'mint-ui';
import util from '../../common/util';

Vue.use(InfiniteScroll);
Vue.component(Spinner.name, Spinner);

util.initApp({
    role: 'doctor'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            document.title = '诊疗记录';
        },
        render: h => h(App)
    });
});
