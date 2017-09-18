import Vue from 'vue';
import App from './App.vue';
import {Cell, InfiniteScroll, Button, Spinner} from 'mint-ui';
import util from '../../common/util';

Vue.component(Cell.name, Cell);
Vue.use(InfiniteScroll);
Vue.component(Button.name, Button);
Vue.component(Spinner.name, Spinner);

util.initApp({
    role: 'doctor'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            util.setTitle('添加随访计划');
        },
        render: h => h(App)
    });
});
