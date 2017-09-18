import Vue from 'vue';
import App from './App.vue';
import {Button, DatetimePicker, Cell, Field} from 'mint-ui';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Cell.name, Cell);
Vue.component(Field.name, Field);

util.initApp({
    role: 'user'
}, function () {
    userAuth.verifyUser().then(function () {
        new Vue({ //eslint-disable-line no-new
            el: '#app',
            created: function () {
                util.setTitle('添加血压记录');
            },
            render: h => h(App)
        });
    });
});
