import Vue from 'vue';
import App from './App.vue';
import {Button, InfiniteScroll, Spinner} from 'mint-ui';
import util from '../../common/util';

Vue.use(InfiniteScroll);
Vue.component(Spinner.name, Spinner);
Vue.component(Button.name, Button);

util.initApp({
    role: 'user'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            util.setTitle('诊疗记录');
        },
        render: h => h(App)
    });
});
