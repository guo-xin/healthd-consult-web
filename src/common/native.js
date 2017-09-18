import global from './global';

let _resolve; //eslint-disable-line no-underscore-dangle
let _reject; //eslint-disable-line no-underscore-dangle, no-unused-vars

//和ios通信时的回调函数
window._setDoctorInfo = function (obj) { //eslint-disable-line no-underscore-dangle
    if (_resolve) {
        _resolve(obj);
    }
};

export default {
    getDoctorInfo() {
        let device = global.getConfig().device;
        let info;

        //由于和ios通信时是异步的，所以采用promise的方式，确保ios回掉成功后再往下执行
        return new Promise(function (resolve, reject) { //eslint-disable-line
            _resolve = resolve;
            _reject = reject;

            if (device == 'ios') {
                let webkit = window.webkit;
                if (webkit && webkit['messageHandlers'] && webkit['messageHandlers'].getDoctorInfo) {
                    webkit['messageHandlers'].getDoctorInfo.postMessage('_setDoctorInfo');
                } else {
                    resolve({});
                }
            } else {
                if (window['client'] && window['client'].getDoctorInfo) {
                    info = window['client'].getDoctorInfo();

                    try {
                        info = JSON.parse(info);
                        resolve(info);
                    } catch (e) {
                        resolve({});
                    }
                } else {
                    resolve({});
                }
            }
        });
    },

    topFunc(flag) {
        let device = global.getConfig().device;

        if (device == 'ios') {
            let webkit = window.webkit;
            if (webkit && webkit['messageHandlers'] && webkit['messageHandlers']['topFunc']) {
                webkit['messageHandlers']['topFunc'].postMessage(flag);
            }
        } else {
            if ( window['client'] && window['client']['topFunc']) {
                window['client']['topFunc'](flag);
            }
        }
    },

    //eslint-disable-next-line
    /**
     *
     * @param device
     * @param method
     * @param {type, reload}
     * type 0: 加载新页面，1：返回
     * reload  0：返回后不需要重新加载页面，1：返回后需要重新加载页面
     */
    changeLocationInApp(method, params) {
        let device = global.getConfig().device;

        if (device == 'ios') {
            let webkit = window.webkit;
            if (webkit && webkit['messageHandlers'] && webkit['messageHandlers'][method]) {
                webkit['messageHandlers'][method].postMessage(params);
            }
        } else {
            if ( window['client'] && window['client'][method]) {
                window['client'][method](JSON.stringify(params));
            }
        }
    }
};
