import Http from './http';
import util from './util';
import store from 'store';

function verifyUser() {
    let code = util.getParams('code');
    let openId = util.getParams('openId');

    if (code || openId) {
        if (code) {
            window.history.replaceState({}, document.title, window.location.href.replace('code=', 'oldCode='));
        }

        return new Promise(function (resolve, reject) { //eslint-disable-line no-undef, no-unused-vars
            Http.get('/baseApi/user/info', {
                params: {
                    code: code,
                    openId: openId
                }
            }).then(
                (response) => {
                    let res = response.data;

                    if (res.result === 0) {
                        store.set('_userInfo', res.data);

                        resolve(response);
                    } else {
                        resolve(null);
                    }
                },

                (response) => resolve(null) //eslint-disable-line no-unused-vars
            );
        });
    } else {
        return new Promise(function (resolve, reject) { //eslint-disable-line no-undef, no-unused-vars
            resolve(null);
        });
    }
}

function getUserInfo(key) {
    let user = store.get('_userInfo') || {};
    return key ? user[key] : user;
}

function update(key, value) {
    let user = store.get('_userInfo') || {};

    if (key) {
        if (typeof key == 'object') {
            store.set('_userInfo', Object.assign(user, key));
        } else {
            user[key] = value;
            store.set('_userInfo', user);
        }
    }
}

export default {
    verifyUser,
    getUserInfo,
    update
};
