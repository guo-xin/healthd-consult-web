import Vue from 'vue';
import App from './App.vue';
import { Button, Cell, Popup, Checklist } from 'mint-ui';
import util from '../../common/util';

Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);
Vue.component(Popup.name, Popup);
Vue.component(Checklist.name, Checklist);

util.initApp({
    role: 'doctor'
}, function () {
    new Vue({ //eslint-disable-line no-new
        el: '#app',
        created: function () {
            document.title = '';
        },
        render: h => h(App)
    });
});
