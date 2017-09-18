import Http from './http';
import global from './global';
import native from './native';
import { Indicator, Toast } from 'mint-ui'; //eslint-disable-line no-unused-vars

import md5 from 'md5';

//获取params的key对应的value
const getParams = (key) => {
    // 获取参数
    let url = window.location.search;
    // 正则筛选地址栏
    let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    // 匹配目标参数
    let result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : '';
};

//回到微信页面情况
const windowClose = () => {
    if (typeof WeixinJSBridge != 'undefined') {
        WeixinJSBridge.call('closeWindow'); //eslint-disable-line no-undef
    }
};

//返回控制
const backControl = () => {
    //控制后退，指定后退页面
    let referrer = document.referrer || '';

    if (referrer.indexOf('addBasicInfo.html') != -1 || referrer.indexOf('doctorDescribe.html') != -1) {
        if (window.history && window.history.pushState) {
            window.addEventListener('popstate', function () {
                window.history.go(-3);
            });
            window.history.pushState('forward', '', '');
        }
    }
};

function getDeviceInfo() {
    let device = getParams('device');
    let d = (device + '').toLowerCase();
    let accessFromApp = false;

    if (d == 'ios' || d == 'android') {
        accessFromApp = true;
    }

    return {
        device: device || '',
        accessFromApp: accessFromApp
    };
}

const initApp = (config = {}, callback) => {
    let flag = true; //是否渲染页面
    let deviceInfo = getDeviceInfo();

    //每次进入页面强制刷新一次，防止后退时
    /*if (!deviceInfo.accessFromApp) {
     if (window.name != 'forceReload') {
     window.location.reload(true);
     window.name = 'forceReload';
     flag = false;
     } else {
     window.name = '';
     }
     }*/

    if (!deviceInfo.accessFromApp) {
        backControl();
    }

    if (flag) {
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            // 通过下面这个API隐藏右上角按钮
            if (typeof WeixinJSBridge != 'undefined') {
                WeixinJSBridge.call('hideOptionMenu'); //eslint-disable-line no-undef
            }
        });
        //屏蔽右键功能
        document.oncontextmenu = function () {
            return false;
        };
        document.onselectstart = function () {
            return false;
        };

        global.setConfig(Object.assign({}, config, deviceInfo));

        if (deviceInfo.accessFromApp && config.role == 'doctor') {
            //医生app端处理
            native.getDoctorInfo().then(
                (response) => {
                    let timestamp = new Date().valueOf(); //eslint-disable-line no-shadow
                    config = global.getConfig();
                    global.setConfig(Object.assign({}, config, response, {
                        chronicdDoctorId: getParams('chronicdDoctorId'),
                        ts: timestamp + '',
                        tk: md5('chronicd_' + timestamp)
                    }));
                    _callback();
                },
                () => {
                    _callback();
                }
            );
        } else {
            _callback();
        }
    }

    function _callback() { //eslint-disable-line no-underscore-dangle
        if (typeof callback == 'function') {
            callback();
        }
    }
};

const setTitle = (title) => {
    document.title = title;
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        document.title = title;
        var icoiframe = document.createElement('iframe');
        icoiframe.src = '/favicon.ico';
        icoiframe.style.display = 'none';
        icoiframe.onload = function () {
            setTimeout(function () {
                icoiframe.remove();
            }, 9);
        };

        document.body.appendChild(icoiframe);
    }
};

const setTitleByPatient = (patientId, obj) => {
    let name = getParams('patientName');
    if (name) {
        setTitle(obj.success.replace(/\{\{patient}}/, name));
    } else {
        if (patientId) {
            Http.get('/baseApi/doctor-patient/patient-ext', {
                params: {
                    patientId: patientId
                }
            }).then(
                (response) => {
                    let res = response.data;
                    if (res.result == 0) {
                        let patient = (res.data || {}).patient || {};
                        if (patient.realName) {
                            setTitle(obj.success.replace(/\{\{patient}}/, patient.realName));
                            return;
                        }
                    }
                    setTitle(obj.fail);
                },
                () => {
                    setTitle(obj.fail);
                }
            );
        } else {
            setTitle(obj.fail);
        }
    }
};

//页面跳转
const changeLocation = (data) => {
    let url = data.changeTo;
    let config = global.getConfig();

    if (data.query) {
        if (url.charAt(url.length - 1) != '?') {
            url += '?';
        }
        for (let key in data.query) {
            url = url + key + '=' + data.query[key] + '&';
        }
        url = url.slice(0, -1);
    }

    url = timestamp(url);

    if (config.accessFromApp && !data.currWin) {
        let reload = data.reload;
        let type = data.type;
        url = getPath() + '/' + url;

        native.changeLocationInApp('nextPage', {
            url: url,
            type: (type == 0 || type == 1) ? type : 1,
            reload: (reload == 0 || reload == 1) ? reload : 1
        });
    } else {
        // history.replaceState({}, document.title, changeUrlParams(window.location.href, 'timestamp', new Date().getTime()));

        setTimeout(() => {
            window.location.href = url;
        }, data.timeOut || 0);
    }
};

//提示信息框
const showMessage = (msg) => {
    let data = {
        message: msg.message || '',
        duration: msg.duration || 1000,
        className: msg.className || '',
        iconClass: msg.iconClass || '',
        position: msg.position || 'middle'
    };

    switch (msg.type) {
    case 'saveSuc':
        data.message = '保存成功';
        Toast(data);
        break;
    case 'saveFai':
        data.message = '保存失败';
        Toast(data);
        break;
    case 'addSuc':
        data.message = '添加成功';
        Toast(data);
        break;
    case 'addFai':
        data.message = '添加失败';
        Toast(data);
        break;
    case 'deleteSuc':
        data.message = '删除成功';
        Toast(data);
        break;
    case 'deleteFai':
        data.message = '删除失败';
        Toast(data);
        break;
    case 'loadFai':
        data.message = '数据加载失败';
        Toast(data);
        break;
    case 'validateWro':
        data.message = '验证码有误';
        Toast(data);
        break;
    case 'validateAlr':
        data.message = '验证码已发送';
        Toast(data);
        break;
    case 'validateSendFai':
        data.message = '验证码发送失败';
        Toast(data);
        break;
    case 'validateFai':
        data.message = '验证码验证失败';
        Toast(data);
        break;
    default:
        Toast(data);
        break;
    }
};

//给url添加时间戳
function timestamp(url) {
    var getTimestamp = new Date().getTime();

    if (url.indexOf('?') > -1) {
        url = url + '&timestamp=' + getTimestamp;
    } else {
        url = url + '?timestamp=' + getTimestamp;
    }

    return url;
}

//过滤emoji
function filterEmoji(text) {
    var ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]'
    ];
    return text.replace(new RegExp(ranges.join('|'), 'g'), '');
}

//获取相对路径
function getPath() {
    let location = window.location;
    let pathName = location.pathname;
    let index = pathName.substr(1).lastIndexOf('/');
    return location.origin + pathName.substr(0, index + 1);
}

//改变url参数值
function changeUrlParams(url, ref, value) { //eslint-disable-line no-unused-vars
    let str = '';
    if (url.indexOf('?') != -1) {
        str = url.substr(url.indexOf('?') + 1);
    } else {
        return url + '?' + ref + '=' + value;
    }
    let returnUrl = '';
    let setParam = '';
    let arr;
    let modify = '0';
    if (str.indexOf('&') != -1) {
        arr = str.split('&');
        for (let i in arr) {
            if (arr[i].split('=')[0] == ref) {
                setParam = value;
                modify = '1';
            } else {
                setParam = arr[i].split('=')[1];
            }
            returnUrl = returnUrl + arr[i].split('=')[0] + '=' + setParam + '&';
        }
        returnUrl = returnUrl.substr(0, returnUrl.length - 1);
        if (modify == '0') {
            if (returnUrl == str) {
                returnUrl = returnUrl + '&' + ref + '=' + value;
            }
        }
    } else {
        if (str.indexOf('=') != -1) {
            arr = str.split('=');
            if (arr[0] == ref) {
                setParam = value;
                modify = '1';
            } else {
                setParam = arr[1];
            }
            returnUrl = arr[0] + '=' + setParam;
            if (modify == '0') {
                if (returnUrl == str) {
                    returnUrl = returnUrl + '&' + ref + '=' + value;
                }
            }
        } else {
            returnUrl = ref + '=' + value;
        }
    }
    return url.substr(0, url.indexOf('?')) + '?' + returnUrl;
}

export default {
    initApp,
    getParams,
    setTitle,
    setTitleByPatient,
    showMessage,
    changeLocation,
    filterEmoji,
    windowClose,
    backControl
};
