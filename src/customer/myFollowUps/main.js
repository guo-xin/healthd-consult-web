import Vue from 'vue';
import App from './App.vue';
import {Cell, InfiniteScroll,Spinner} from 'mint-ui';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

Vue.component(Cell.name, Cell);
Vue.use(InfiniteScroll);
Vue.component(Spinner.name, Spinner);

util.initApp({
    role: 'user'
}, function () {
    userAuth.verifyUser().then(function () {
        if (userAuth.getUserInfo('isComplete') != 1) {
            util.changeLocation({
                changeTo: 'addBasicInfo.html',
                timeOut: 600,
                query: {
                    historyPage: 'myFollowUps.html'
                }
            });
        } else {
            new Vue({ //eslint-disable-line no-new
                el: '#app',
                created: function () {
                    util.setTitle('随访计划');
                },
                render: h => h(App)
            });
        }
    });
});
