import Vue from 'vue';
import App from './App.vue';
import { Button, InfiniteScroll, Spinner } from 'mint-ui';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(Spinner.name, Spinner);
Vue.use(InfiniteScroll);

util.initApp({
    role: 'user'
}, function () {
    userAuth.verifyUser().then(function () {
        new Vue({ //eslint-disable-line no-new
            el: '#app',
            created: function () {
                util.setTitle('选择医生');
            },
            render: h => h(App)
        });
    });
});
