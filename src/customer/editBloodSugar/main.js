import Vue from 'vue';
import App from './App.vue';
import {Button, DatetimePicker, Cell, Field} from 'mint-ui';
import SelectPicker from '../../components/selectPicker.vue';
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Cell.name, Cell);
Vue.component(Field.name, Field);
Vue.component(SelectPicker.name, SelectPicker);

util.initApp({
    role: 'user'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            util.setTitle('编辑血糖记录');
        },
        render: h => h(App)
    });
});
