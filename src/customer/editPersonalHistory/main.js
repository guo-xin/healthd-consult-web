import Vue from 'vue';
import App from './App.vue';
import {Field, Checklist, Button} from 'mint-ui';
import util from '../../common/util';

Vue.component(Field.name, Field);
Vue.component(Checklist.name, Checklist);
Vue.component(Button.name, Button);

util.initApp({
    role: 'user'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            util.setTitle('个人病史');
        },
        render: h => h(App)
    });
});
