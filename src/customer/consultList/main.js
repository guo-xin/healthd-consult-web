import Vue from 'vue';
import App from './App.vue';
import { Button, InfiniteScroll, Spinner } from 'mint-ui';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(Spinner.name, Spinner);
Vue.use(InfiniteScroll);

util.initApp({
    role: 'user'
}, function () {
    userAuth.verifyUser().then(function () {
        if (userAuth.getUserInfo('isComplete') != 1) {
            util.changeLocation({
                changeTo: 'addBasicInfo.html',
                timeOut: 600,
                query: {
                    historyPage: 'consultList.html'
                }
            });
        } else {
            new Vue({ //eslint-disable-line no-new
                el: '#app',
                created: function () {
                    util.setTitle('咨询列表');
                },
                render: h => h(App)
            });
        }
    });
});
