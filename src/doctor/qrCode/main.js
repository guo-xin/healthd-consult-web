import Vue from 'vue';
import App from './App.vue';
import doctorAuth from '../../common/doctorAuth';
import util from '../../common/util';

util.initApp({
    role: 'doctor'
}, function () {
    doctorAuth.verifyDoctor().then(function () {
        new Vue({ //eslint-disable-line no-new
            el: '#app',
            created: function () {
                util.setTitle('我的二维码');
            },
            render: h => h(App)
        });
    });
});
