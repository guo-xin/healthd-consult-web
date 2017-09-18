import Vue from 'vue';
import {Button, Cell} from 'mint-ui';
import App from './App.vue';
import util from '../../common/util';
import userAuth from '../../common/userAuth';

Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);

util.initApp({
    role: 'user'
}, function () {
    userAuth.verifyUser().then(function () {
        new Vue({ //eslint-disable-line no-new
            el: '#app',
            created: function () {
                util.setTitle('随访计划详情');
            },
            render: h => h(App)
        });
    });
});
