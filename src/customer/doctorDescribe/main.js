import Vue from 'vue';
import App from './App.vue';
import { Button } from 'mint-ui';
import util from '../../common/util';

Vue.component(Button.name, Button);

util.initApp({
    role: 'user'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            util.setTitle('症状描述');
        },
        render: h => h(App)
    });
});
