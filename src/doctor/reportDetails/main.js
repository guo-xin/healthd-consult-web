import Vue from 'vue';
import { Button, Cell, DatetimePicker, InfiniteScroll } from 'mint-ui';
import App from './App.vue';
import userAuth from '../../common/userAuth';
import util from '../../common/util';


Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.use(InfiniteScroll );

util.initApp({
    role: 'doctor'
}, function () {
    userAuth.verifyUser().then(function () {
        new Vue({ //eslint-disable-line no-new
            el: '#app',
            created: function () {
                document.title = '报到明细';
            },
            render: h => h(App)
        });
    });
});
