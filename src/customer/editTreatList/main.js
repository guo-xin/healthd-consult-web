import Vue from 'vue';
import App from './App.vue';
import {Field,Picker,DatetimePicker, Button} from 'mint-ui';
import SelectPicker from '../../components/selectPicker.vue';
import imgUpload from '../../components/imgUpload.vue';
import util from '../../common/util';

Vue.component(Field.name, Field);
Vue.component(Picker.name, Picker);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Button.name, Button);
Vue.component(SelectPicker.name, SelectPicker);
Vue.component('imgupload', imgUpload);

util.initApp({
    role: 'user'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            util.setTitle('编辑诊疗记录');
        },
        render: h => h(App)
    });
});
