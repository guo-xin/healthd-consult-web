import Vue from 'vue';
import { Button, Cell } from 'mint-ui';
import App from './App.vue';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);

util.initApp({
    role: 'user'
}, function () {
    userAuth.verifyUser().then(function () {
        new Vue({ //eslint-disable-line no-new
            el: '#app',
            created: function () {
                document.title = '';
            },
            render: h => h(App)
        });
    });
});
