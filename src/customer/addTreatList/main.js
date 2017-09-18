import Vue from 'vue';
import App from './App.vue';
import {Field,Picker,DatetimePicker, Button} from 'mint-ui';
import SelectPicker from '../../components/selectPicker.vue';
import imgUpload from '../../components/imgUpload.vue';
import userAuth from '../../common/userAuth';
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
    userAuth.verifyUser().then(function () {
        if (userAuth.getUserInfo('isComplete') != 1) {
            util.changeLocation({
                changeTo: 'addBasicInfo.html',
                timeOut: 600,
                query: {
                    historyPage: 'addTreatList.html'
                }
            });
        } else {
            new Vue({ //eslint-disable-line no-new
                el: '#app',
                created: function () {
                    util.setTitle('添加诊疗记录');
                },
                render: h => h(App)
            });
        }
    });
});
