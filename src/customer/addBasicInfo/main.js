import Vue from 'vue';
import App from './App.vue';
import { Button, Field, DatetimePicker, Actionsheet, Checklist } from 'mint-ui';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(Field.name, Field);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Checklist.name, Checklist);

function gotoMyDoctors() {
    util.changeLocation({
        changeTo: 'doctorList.html',
        timeOut: 600
    });
}

util.initApp({
    role: 'user'
}, function () {
    userAuth.verifyUser().then(function () {
        //用户已完善过基本信息
        if (userAuth.getUserInfo('isComplete') == 1) {
            let chronicdDoctorId = util.getParams('chronicdDoctorId');
            let patientId = userAuth.getUserInfo('patientId');

            if (chronicdDoctorId) {
                Vue.http.get('/baseApi/consult-conversation/conversation-id', {
                    params: {
                        chronicdDoctorId: chronicdDoctorId,
                        patientId: patientId
                    }
                }).then(
                    (response) => {
                        let res = response.data;
                        if (res.result == 0) {
                            util.changeLocation({
                                changeTo: 'im/index.html',
                                timeOut: 600,
                                query: {
                                    roleCode: 1,
                                    consultConversationId: res.data.consultConversationId
                                }
                            });
                        } else {
                            gotoMyDoctors();
                        }
                    },
                    () => {
                        gotoMyDoctors();
                    }
                );
            } else {
                util.windowClose();
            }
        } else {
            new Vue({ //eslint-disable-line no-new
                el: '#app',
                created: function () {
                    document.title = '';
                },
                render: h => h(App)
            });
        }
    });
});

