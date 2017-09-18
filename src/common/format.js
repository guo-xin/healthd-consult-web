/**
 * Created by guoxin on 2016/11/24.
 */
//日期格式化
const formatDate = (parDate, formatStr) => {
    let date = new Date(parDate);
    /*
     函数：填充0字符
     参数：value-需要填充的字符串, length-总长度
     返回：填充后的字符串
     */
    let zeroize = function (value, length) {
        let i, zeros;
        if (!length) {
            length = 2;
        }
        value = value + ''; //eslint-disable-line no-new-wrappers
        for (i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value; //eslint-disable-line block-scoped-var
    };

    if (!formatStr) {
        formatStr = 'yyyy.MM.dd';
    }

    return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function ($0) { //eslint-disable-line consistent-return
        switch ($0) {
        case 'd':
            return date.getDate();
        case 'dd':
            return zeroize(date.getDate());
        case 'ddd':
            return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()];
        case 'dddd':
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
        case 'M':
            return date.getMonth() + 1;
        case 'MM':
            return zeroize(date.getMonth() + 1);
        case 'MMM':
            return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
        case 'MMMM':
            return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
        case 'yy':
            return (date.getFullYear() + '').substr(2); //eslint-disable-line no-new-wrappers
        case 'yyyy':
            return date.getFullYear();
        case 'h':
            return date.getHours() % 12 || 12;
        case 'hh':
            return zeroize(date.getHours() % 12 || 12);
        case 'H':
            return date.getHours();
        case 'HH':
            return zeroize(date.getHours());
        case 'm':
            return date.getMinutes();
        case 'mm':
            return zeroize(date.getMinutes());
        case 's':
            return date.getSeconds();
        case 'ss':
            return zeroize(date.getSeconds());
        case 'l':
            return date.getMilliseconds();
        case 'll':
            return zeroize(date.getMilliseconds());
        case 'tt':
            return date.getHours() < 12 ? 'am' : 'pm';
        case 'TT':
            return date.getHours() < 12 ? 'AM' : 'PM';
        }
    });
};

//年月日格式化
const formatYear = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month > 9 ? month : '0' + month;
    let day = date.getDate();
    day = day > 9 ? day : '0' + day;

    date = year + '' + month + '' + day;
    return date;
};

//计算时间
const formatTime = (time) => {
    if (time) {
        let m = Math.floor(time / 60);
        let s = Math.floor(time % 60);
        let str = '';
        let h = Math.floor(m / 60);

        if (h > 0) {
            m = m % 60;
            str = str + h + '小时';
        }
        if (m > 0) {
            str = str + m + '分';
            if (s <= 0) {
                str = str + '钟';
            }
        }

        if (s > 0) {
            str = str + s + '秒';
        }
        return str;
    } else if (time === 0) {
        return '0秒';
    } else {
        return '';
    }
};


//根据时间计算年龄
const formatAge = (value) => {
    let dayStr = '';
    if (value) {
        let d = new Date();

        let curY = d.getFullYear();
        let curM = d.getMonth() + 1;
        let curD = d.getDate();
        d = new Date(curY, curM - 1, curD);

        let birthDay = new Date(value);

        let [y, m, day] = [birthDay.getFullYear(), birthDay.getMonth() + 1, birthDay.getDate()];

        birthDay = new Date(y, m - 1, day);
        let birthInThisYear = new Date(curY, m - 1, day + 1);

        let diff = curY - y;
        let diffDay = 0;

        if (birthInThisYear <= d) {
            if (diff > 2) {
                dayStr = diff + '岁';
            } else if (diff > 0) {
                dayStr = diff + '岁';
                diffDay = (d - birthInThisYear) / (24 * 60 * 60 * 1000);

                if (diffDay > 0) {
                    dayStr = dayStr + diffDay + '天';
                }
            } else {
                diffDay = (d - birthDay) / (24 * 60 * 60 * 1000) - 1;
                diffDay = diffDay < 0 ? 0 : diffDay;
                dayStr = diffDay + '天';
            }
        } else {
            if (diff > 3) {
                dayStr = (diff - 1) + '岁';
            } else if (diff > 1) {
                dayStr = (diff - 1) + '岁';
                diffDay = (d - new Date(curY - 1, m - 1, day)) / (24 * 60 * 60 * 1000) - 1;
                if (diffDay > 0) {
                    dayStr = dayStr + diffDay + '天';
                }
            } else {
                diffDay = (d - birthDay) / (24 * 60 * 60 * 1000) - 1;
                diffDay = diffDay < 0 ? 0 : diffDay;
                dayStr = diffDay + '天';
            }
        }
    }

    return dayStr;
};

const formatBP = (low, high, age) => {
    let data = {};

    if (high >= 180 || low >= 110) {
        data = {
            text: '极高',
            className: '',
            color: '#ff5858',
            isHigh: true
        };
    } else if (high >= 140 || low >= 90) {
        data = {
            text: '高血压',
            className: '',
            color: '#ff8903',
            isHigh: true
        };
    } else if ((high >= 120 && high <= 139) || (low >= 80 && low <= 89)) {
        if (age && age > 50) {
            data = {
                text: '',
                className: '',
                color: '#00b4eb',
                isHigh: false
            };
            return data;
        }
        data = {
            text: '正常高值',
            className: '',
            color: '#00b4eb',
            isHigh: true
        };
    } else {
        data = {
            text: '正常',
            className: '',
            color: '',
            isHigh: false
        };
    }

    return data;
};

const formatRemind = (type) => {
    return ['复诊提醒', '用药提醒', '换药提醒', '', '手术提醒', '注意事项'][type];
};

const formatDateType = (type) => {
    return ['首次治疗', '就诊日期', '治疗结束', '出院日期', '手术日期', '末次月经'][type];
};

const formatSendPoint = (type) => {
    return '距' + ['首次治疗', '就诊日期', '治疗结束', '', '出院日期', '手术日期', '末次月经'][type] + '后';
};

const formatContext = (type) => {
    return ['请于近日来院复诊、复查', '请遵医嘱按时按量服药', '请于近日返院换药', '', '请于近日至医院手术（手术当日请空腹）', ''][type];
};

const formatSendPeriod = (type, days) => {
    let unitText;
    let num;

    switch (type) {
    case 0:
        unitText = '天';
        num = days;
        break;

    case 1:
        unitText = '周';
        num = days / 7;
        break;

    case 2:
        unitText = '月';
        num = days / 30;
        break;

    case 3:
        unitText = '年';
        num = days / 365;
        break;

    default:
    }

    return num + unitText;
};

const formatSendDate = (startDate, days) => {
    return formatDate(startDate.valueOf() + days * 24 * 60 * 60 * 1000);
};

export default {
    formatTime,
    formatDate,
    formatYear,
    formatAge,
    formatBP,
    formatRemind,
    formatSendPoint,
    formatSendDate,
    formatSendPeriod,
    formatDateType,
    formatContext
};
