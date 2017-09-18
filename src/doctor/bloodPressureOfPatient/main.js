import Vue from 'vue';
import App from './App.vue';
import {Button, Cell, Spinner, InfiniteScroll} from 'mint-ui';
import Http from '../../common/http'; //eslint-disable-line no-unused-vars
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);
Vue.component(Spinner.name, Spinner);
Vue.use(InfiniteScroll);

util.initApp({
    role: 'doctor'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            document.title = '患者血压数据';
        },
        render: h => h(App)
    });
});
