import Vue from 'vue';
import App from './App.vue';
import {Button, InfiniteScroll, Spinner } from 'mint-ui';
import doctorAuth from '../../common/doctorAuth';
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(Spinner.name, Spinner);
Vue.use(InfiniteScroll );

util.initApp({
    role: 'doctor'
}, function () {
    doctorAuth.verifyDoctor().then(function () {
        new Vue({ //eslint-disable-line no-new
            el: '#app',
            created: function () {
                util.setTitle('我的患者');
            },
            render: h => h(App)
        });
    });
});
