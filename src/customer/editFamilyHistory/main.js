import Vue from 'vue';
import App from './App.vue';
import {Field, Popup, Checklist, Button} from 'mint-ui';
import util from '../../common/util';

Vue.component(Field.name, Field);
Vue.component(Popup.name, Popup);
Vue.component(Checklist.name, Checklist);
Vue.component(Button.name, Button);

util.initApp({
    role: 'user'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            util.setTitle('家族病史');
        },
        render: h => h(App)
    });
});
