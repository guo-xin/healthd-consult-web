import Vue from 'vue';
import App from './App.vue';
import {Cell} from 'mint-ui';
import util from '../../common/util';

Vue.component(Cell.name, Cell);

util.initApp({
    role: 'doctor'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            document.title = '血压记录详情';
        },
        render: h => h(App)
    });
});
