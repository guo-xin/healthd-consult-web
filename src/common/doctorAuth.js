import Http from './http';
import util from './util';
import store from 'store';
import global from './global';

function verifyDoctor() {
    let code = util.getParams('code');
    let openId = util.getParams('openId');

    if (code || openId) {
        if (code) {
            window.history.replaceState({}, document.title, window.location.href.replace('code=', 'oldCode='));
        }

        return new Promise(function (resolve, reject) { //eslint-disable-line no-undef, no-unused-vars
            Http.get('/baseApi/doctor/info', {
                params: {
                    code: code,
                    openId: openId
                }
            }).then(
                (response) => {
                    let res = response.data;

                    if (res.result === 0) {
                        store.set('_doctorInfo', res.data);
                        resolve(response);
                    } else {
                        if (res.code == -1014) {
                            store.set('_doctorInfo', {
                                exist: false
                            });
                        }

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

function getDoctorInfo(key) {
    let user = store.get('_doctorInfo') || {};
    return key ? user[key] : user;
}

function getDoctorId() {
    let config = global.getConfig();
    let accessFromApp = config.accessFromApp;
    let doctorId = '';

    if (accessFromApp) {
        doctorId = config.chronicdDoctorId;
    } else {
        doctorId = getDoctorInfo('chronicdDoctorId');
    }

    return doctorId;
}

export default {
    verifyDoctor,
    getDoctorInfo,
    getDoctorId
};
