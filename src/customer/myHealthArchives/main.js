import userAuth from '../../common/userAuth';
import Vue from 'vue';
import App from './App.vue';
import util from '../../common/util';

util.initApp({
    role: 'user'
}, function () {
    userAuth.verifyUser().then(function () {
        if (userAuth.getUserInfo('isComplete') != 1) {
            util.changeLocation({
                changeTo: 'addBasicInfo.html',
                timeOut: 600,
                query: {
                    historyPage: 'myHealthArchives.html'
                }
            });
        } else {
            new Vue({ //eslint-disable-line no-new
                el: '#app',
                created: function () {
                    util.setTitle('我的健康档案');
                },
                render: h => h(App)
            });
        }
    });
});
