import Vue from 'vue';
import { Button, Cell } from 'mint-ui';
import App from './App.vue';
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);

util.initApp({
    role: 'doctor'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            util.setTitle('患者资料');
        },
        render: h => h(App)
    });
});
