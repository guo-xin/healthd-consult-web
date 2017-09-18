import Vue from 'vue';
import App from './App.vue';
import {Field, Popup, Picker, Actionsheet, DatetimePicker, Button} from 'mint-ui';
import SelectPicker from '../../components/selectPicker.vue';
import util from '../../common/util';

Vue.component(Field.name, Field);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Popup.name, Popup);
Vue.component(Picker.name, Picker);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Button.name, Button);
Vue.component(SelectPicker.name, SelectPicker);

//格式化性别0:男；1:女
const sexList = [
    {value: 0,text: '男'},
    {value: 1,text: '女'}
];
Vue.filter('sex', function (val) {
    return (sexList.find((item)=> {
        return item.value == val;
    }) || {}).text;
});
//格式化婚姻状况0-未婚；1-已婚
const marriageList = [
    {value: 0,text: '未婚'},
    {value: 1,text: '已婚'}
];
Vue.filter('maritalStatus', function (val) {
    return (marriageList.find((item)=> {
        return item.value == val;
    }) || {}).text;
});

util.initApp({
    role: 'user'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            util.setTitle('基本信息');
        },
        render: h => h(App)
    });
});
