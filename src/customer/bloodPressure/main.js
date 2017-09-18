import Vue from 'vue';
import App from './App.vue';
import {Button, Cell, Spinner, InfiniteScroll} from 'mint-ui';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);
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
                    historyPage: 'bloodPressure.html'
                }
            });
        } else {
            new Vue({ //eslint-disable-line no-new
                el: '#app',
                created: function () {
                    util.setTitle('血压数据');
                },
                render: h => h(App)
            });
        }
    });
});
