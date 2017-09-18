import Vue from 'vue';
import {Button, Field, Cell, DatetimePicker, Switch} from 'mint-ui';
import App from './App.vue';
import util from '../../common/util';
import IntervalDatePicker from '../../components/intervalDatePicker.vue';
import SelectPicker from '../../components/selectPicker.vue';

Vue.component(Button.name, Button);
Vue.component(Field.name, Field);
Vue.component(Cell.name, Cell);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Switch.name, Switch);
Vue.component(IntervalDatePicker.name, IntervalDatePicker);
Vue.component(SelectPicker.name, SelectPicker);

util.initApp({
    role: 'doctor'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            util.setTitle('添加模板');
        },
        render: h => h(App)
    });
});
