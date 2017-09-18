<template>
    <div id="app">

        <div class="notice">
            <p>
                您需要完善您的个人信息，否则医生无法接收到您的消息
            </p>
        </div>

        <div class="verify-phone" v-if="step==1">
            <div class="form-control">
                <mt-field placeholder="请输入手机号码" type="tel" v-model.trim="item.phone" :attr="{maxlength: 11}">
                    <span>
                        <span @click="sendCode" v-show="!isSendCode">
                            发送验证码
                        </span>
                        <span v-show="isSendCode" ref="timer"></span>
                    </span>
                </mt-field>
            </div>

            <div class="form-control">
                <mt-field placeholder="请填入您手机收到的验证码" type="tel" v-model.trim="item.code"
                          :attr="{maxlength: 6}"></mt-field>
            </div>

            <div class="form-control">
                <label class="agreement-checkbox">
                    <span class="mint-checkbox">
                        <input type="checkbox" class="mint-checkbox-input" v-model="checked">
                        <span class="mint-checkbox-core"></span>
                    </span>
                    <span class="mint-checkbox-label">我同意<a href="javascript:void(0)" @click="isShowAgreement=true">《用户注册协议》</a></span>
                </label>
            </div>

            <div class="form-action">
                <mt-button @click.native="next" type="primary" size="large"
                           :disabled="!(checked && item.code && item.phone)">
                    下一步
                </mt-button>
            </div>
        </div>

        <div class="info" v-if="step==2">
            <mt-datetime-picker
                    type="date"
                    ref="picker"
                    v-model="selectedDate"
                    :startDate="startDate"
                    :endDate="endDate"
                    @confirm="confirmDate"
                    year-format="{value} 年"
                    month-format="{value} 月"
                    date-format="{value} 日">
            </mt-datetime-picker>


            <div class="form-control">
                <mt-field label="姓名" placeholder="请填写" type="text" v-model="item.userName"
                          :attr="{maxlength: 16}"></mt-field>
            </div>

            <div class="form-control">
                <mt-field label="性别" placeholder="请选择" type="text" readonly @click.native="sexVisible = true"
                          v-model="sex"></mt-field>
            </div>

            <div class="form-control">

                <mt-field label="出生日期" placeholder="请选择" type="text" readonly @click.native="openPicker"
                          v-model="birthday"></mt-field>
            </div>

            <div class="form-action">
                <mt-button @click.native="confirm" type="primary" size="large"
                           :disabled="!(item.userName&&(item.sex==0 || item.sex==1)&&item.birthday&&!disableConfirm)">
                    确认完善信息
                </mt-button>
            </div>
        </div>


        <mt-actionsheet :actions="sexActions" v-model="sexVisible" cancel-text=""></mt-actionsheet>

        <div class="agreement" v-show="isShowAgreement">
            <div class="content">
                <dl>
                    <dt>
                        <span>览海健康用户协议&隐私政策</span>
                        <span>1.服务条款的确认和接纳</span>
                    </dt>
                    <dd>
                        览海健康的所有权和运作权归上海览海在线健康管理有限公司所有，览海健康所提供的服务将完全按照其发布的章程、服务条款和操作规则严格执行。用户必须完全同意所有服务条款并完成注册程序，才能成为览海健康的正式用户。
                    </dd>
                    <dt>
                        <span>2.服务简介</span>
                    </dt>
                    <dd>览海健康运用自己的操作系统通过国际互联网为用户提供网络服务，并承担服务条款和入网协议中对用户的责任和义务。</dd>
                    <dt>
                        <span>用户必须：</span>
                        <span>(1)自行配备上网所需的设备，包括个人电脑，调制解调器及其他必备的设备装置；</span>
                        <span>(2)自行负担上网所需的相关必要费用，如：电话费用、网络费用等。</span>
                        <span>同时，用户还应同意：</span>
                        <span>(1)提供详尽、真实和准确的个人资料，并对个人资料不断进行及时的更新；</span>
                        <span>(2)览海健康会员注册入网协议中规定的会员的其他责任和义务。</span>
                    </dt>
                    <dd>
                        如果用户所提供的资料包含不正确的信息，览海健康保留中止为该用户提供网络服务的权利。用户在享有览海健康提供的各种服务的同时，同意接受览海健康提供的其他各类信息服务。医生提供的建议并不能作为诊断、治疗的依据，用户不能直接根据该建议进行诊断、治疗。用户理解并同意，医生在本平台上提供服务的行为是医生基于自身专业知识和临床经验为用户提供健康指导的个人行为，该行为与医生所在的医院无关，任何与本平台上的医生提供服务有关的事宜，均与医生所在医院无关。
                    </dd>
                    <dt>
                        <span>3．服务条款的修改</span>
                    </dt>
                    <dd>览海健康在必要时将修改服务条款，届时将在用户界面提示修改内容，如果用户不同意所作的修改，可以主动取消获得的网络服务。如果用户继续享有览海健康的服务，则被视为接受服务条款变动。
                    </dd>
                    <dt>
                        <span>4．服务修订</span>
                    </dt>
                    <dd>览海健康保留随时修改或中断服务而不需知照用户的权利，不需对用户或第三方负责。</dd>
                    <dt>
                        <span>5．用户隐私制度</span>
                    </dt>
                    <dd>
                        尊重用户隐私是览海健康的一项基本政策。览海健康将对用户资料实行保密，承诺一定不会在未经合法用户授权时公开、编辑或透露其注册资料及保存在览海健康中的非公开内容，但用户可以授权览海健康向第三方公开或透露相关注册的用户信息，有法律许可要求或览海健康在诚信的基础上，认为透露这些信息在以下五种情况是必要的：
                    </dd>
                    <dt>
                        <span>(1)遵守有关法律规定，遵从览海健康合法服务程序；</span>
                        <span>(2)保持维护览海健康的商标所有权；</span>
                        <span>(3)在紧急情况下竭力维护用户个人和社会大众的隐私安全；</span>
                        <span>(4)出于服务需要向览海健康平台内其它医生提供必要的健康档案信息；</span>
                        <span>(5)符合其他相关的要求。</span>
                        <span>6．用户帐号和安全性</span>
                    </dt>
                    <dd>
                        用户一旦注册成功，将成为览海健康的合法用户。每个用户都要对以其用户名进行的所有活动和事件负全责。用户若发现任何非法使用用户帐号或存在安全漏洞的情况，请立即通告览海健康。
                    </dd>
                    <dt>
                        <span>7．拒绝提供担保</span>
                    </dt>
                    <dd>
                        用户个人对网络服务的使用承担风险。览海健康对此不作任何类型的担保，不论是明确的或隐含的，但是不对商业性的隐含担保、特定目的和不违反规定的适当担保作限制。览海健康不担保服务一定能满足用户的要求，也不担保服务不会受中断，对服务的及时性，安全性，出错发生都不作担保。览海健康对在览海健康上得到的任何商品购物服务或交易进程，不作担保。用户不会从览海健康得到口头或书写的意见或信息，也不会在这里做明确担保。
                    </dd>
                    <dt>
                        <span>8．有限责任</span>
                    </dt>
                    <dd>
                        览海健康对任何直接、间接、偶然、特殊及继起的损害不负责任，这些损害可能来自：不正当使用网络服务，在网上购买商品或进行同类型服务，在网上进行交易，非法使用网络服务或用户传送的息有所变动。这些行为都有可能会导致览海健康的形象受损，所以览海健康事先提出这种损害的可能性。因发生如火灾、水灾、暴动、骚乱、战争、自然灾害等不可抗事故，览海健康所不能控制的时间而影响览海健康提供服务，览海健康无须承担任何责任。
                    </dd>
                    <dt>
                        <span>9．对用户信息的存储和限制</span>
                    </dt>
                    <dd>
                        览海健康不对用户所发布信息的删除或储存失败负责。览海健康有判定用户的行为是否符合览海健康服务条款的要求和精神的保留权利，如果用户违背了服务条款的规定，则中断会员用户服务的帐号。览海健康所有的文章版权归原文作者和览海健康共同所有，任何人需要转载览海健康的文章，必须征得原文作者或览海健康授权。
                    </dd>
                    <dt>
                        <span>10． 用户管理</span>
                    </dt>
                    <dd>用户单独承担发布内容的责任。用户对服务的使用是根据所有适用于览海健康的国家法律、地方法律和国际法律标准的。</dd>
                    <dt>
                        <span>用户必须遵循：</span>
                        <span>(1)从中国境内向外传输技术性资料时必须符合中国有关法规；</span>
                        <span>(2)使用网络服务不作非法用途；：</span>
                        <span>(3)不干扰或混乱网络服务；</span>
                        <span>(4)遵守所有使用网络服务的网络协议、规定、程序和惯例。</span>
                    </dt>
                    <dd>
                        用户须承诺不传输任何非法的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽等信息资料。另外，用户也不能传输任何教唆他人构成犯罪行为的资料；不能传输助长国内不利条件和涉及国家安全的资料；不能传输任何不符合当地法规、国家法律和国际法律的资料。未经许可而非法进入其它电脑系统是禁止的。若用户的行为不符合以上提到的服务条款，览海健康将做出独立判断立即停止用户服务帐号的服务。用户需对自己在网上的行为承担法律责任。用户若在览海健康上散布和传播反动、色情或其他违反国家法律的信息，览海健康的系统记录有可能作为用户违反法律的证据。
                    </dd>
                    <dt>
                        <span>11．保障</span>
                    </dt>
                    <dd>用户同意保障和维护览海健康全体成员的利益，负责支付由用户使用超出服务范围引起的律师费用，违反服务条款的损害补偿费用等。</dd>
                    <dt>
                        <span>12．结束服务</span>
                    </dt>
                    <dd>
                        用户或览海健康可随时根据用户管理的规范（参见第10条）和实际情况中断一项或多项网络服务，览海健康无须对个人或第三方负责。用户对后来的条款修改有异议，或对览海健康的服务不满，可以行使如下权利：
                    </dd>
                    <dt>
                        <span>(1)停止使用览海健康的网络服务；</span>
                        <span>(2)通告览海健康停止对该用户的服务。</span>
                    </dt>
                    <dd>结束用户服务后，用户使用网络服务的权利马上中止。从那时起，览海健康不对用户承担任何义务和责任。</dd>
                    <dt>
                        <span>13．通告</span>
                    </dt>
                    <dd>所有发给用户的通告都可以通过重要页面的公告或电子邮件传送。</dd>
                    <dt>
                        <span>14．广告策划</span>
                    </dt>
                    <dd>
                        用户在他们发表的信息中加入宣传资料或广告策划，在览海健康的免费服务上展示他们的产品，任何这类促销方法，包括运输货物、付款、服务、商业条件、担保及与广告有关的描述都只是在相应的用户和广告销售商之间发生。览海健康不承担任何责任，览海健康没有义务为这类广告销售负任何一部分的责任。
                    </dd>
                    <dt>
                        <span>15．网络服务的内容所有权</span>
                    </dt>
                    <dd>
                        览海健康定义的内容包括：文字、软件、声音、相片、录像、图表；广告中的全部内容；电子邮件中的全部内容；览海健康为用户提供的其他信息。所有这些信息均受版权、商标、标签和其他财产所有权法律的保护。用户只能在览海健康和广告商的授权下才能使用这些内容，不能擅自复制、再造或创造与这些内容有关的派生产品。览海健康的所有内容版权归原文作者和览海健康共同所有，任何人需要转载览海健康的内容，必须获得原文作者或览海健康的授权。
                    </dd>
                    <dt>
                        <span>16．法律</span>
                    </dt>
                    <dd>
                        网络服务条款要与中华人民共和国的法解释相一致，用户和览海健康一致同意服从高等法院的所有管辖。如果任何服务条款与法律相抵触，则这些条款将按法律规定重新解释，而其他条款依旧保持对用户产生法律效力和影响。
                    </dd>
                    <dt>
                        <span>版权所有：上海览海在线健康管理有限公司(2017)</span>
                    </dt>

                </dl>
            </div>

            <div class="close">
                <a href="javascript:void(0)"><img src="../../assets/img/icon-close.png"
                                                  @click="isShowAgreement=false"></a>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    .mint-cell .mint-cell-value .mint-field-core {
        text-align: left;
    }

    .mint-popup {
        width: 100%;
    }

    .agreement-checkbox {
        display: flex;
        align-items: center;
        font-size: 0;

        .mint-checkbox-core {
            width: 0.32rem;
            height: 0.32rem;
        }

        .mint-checkbox-label {
            padding-left: 0.05rem;
            margin: 0;
            font-size: @fontSizeSm;

            a {
                color: @blue;
                text-decoration: none;
            }
        }

        .mint-checkbox-core::after {
            top: 0.02rem;
            left: 0.08rem;
            width: 0.08rem;
            height: 0.16rem;
        }
    }

    .notice {
        padding: 0.16rem 0.4rem;
        font-size: @fontSizeSm;

        p {
            color: @textColorLight;
            /*line-height: 1.6;*/
        }
    }

    .verify-phone {
        margin: 0 0.4rem 0.4rem;

        .mint-cell .mint-cell-wrapper {
            padding: 0 0.2rem;
        }

        .mint-field-other {
            position: relative;

            & > span {
                line-height: 1.6;
                color: @blue;
                position: relative;
                padding-left: 0.16rem;
                text-align: center;
                border-left: 1px solid #dbdbdb;
                display: block;
                width: 1.82rem;
            }
        }

        .form-control {
            margin-bottom: 0.4rem;
        }

        .form-action {
            margin-top: 1.4rem;
        }
    }

    .info {
        margin: 0 0 0.4rem;

        .form-control {
            border-bottom: 1px solid @borderColor;

            &:last-child {
                border-bottom: 0;
            }
        }

        .form-action {
            margin: 0.7rem 0.4rem 0;
            button:active {
                background-color: #E6E6E9;
            }
        }
    }

    .form-action {
        .mint-button {
            height: 0.96rem;
            line-height: 0.96rem;
        }
    }

    .agreement {
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(32, 32, 32, 0.50);
        width: 100%;
        height: 100%;
        padding: 0.4rem 0.4rem 1.2rem 0.4rem;

        .content {
            background: #ffffff;
            border-radius: 0.04rem;
            width: 100%;
            height: 100%;
            padding: 0.5rem 0.4rem;
            overflow-y: auto;
        }

        dt {
            font-size: @fontSizeSm;
            color: @textColorBlack;
            line-height: 0.56rem;
            margin: 0.2rem 0 0;

            span {
                display: block;
            }
        }

        dd {
            font-size: @fontSizeXs;
            line-height: 0.36rem;
            margin: 0;

            span {
                display: block;
                margin-bottom: 0.12rem;
            }

            span:last-child {
                margin-bottom: 0;
            }
        }

        .close {
            position: absolute;
            left: 0;
            bottom: 0.2rem;
            width: 100%;
            text-align: center;

            img {
                height: 0.64rem;
            }
        }
    }
</style>

<script lang="babel">
    import { Indicator } from 'mint-ui';
    import format from '../../common/format';
    import util from '../../common/util';
    import userAuth from '../../common/userAuth';

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd');
    }

    export default{
        data() {
            return {
                startDate: new Date('1900/01/01'),
                endDate: new Date(),
                selectedDate: new Date('1985/05/30'),
                birthday: null,

                sex: null,
                sexVisible: false,
                sexActions: [{
                    name: '男',
                    method: () => {
                        return this.checkSex({
                            text: '男',
                            value: 0
                        });
                    }
                }, {
                    name: '女',
                    method: () => {
                        return this.checkSex({
                            text: '女',
                            value: 1
                        });
                    }
                }],

                step: 1,  //1：校验手机号， 2：完善个信息
                isSendCode: false, //是否正在发生验证码
                disableConfirm: false, //是否禁掉完善信息按钮

                checked: true, //是否同意协议
                isShowAgreement: false, //是否显示协议说明

                item: {
                    phone: null,
                    code: null,
                    userName: null,
                    sex: null,
                    birthday: null
                }
            };
        },

        created() {
            this.currentValue = '男';

            util.setTitle('验证手机号码');
        },

        methods: {
            //选择性别
            checkSex(obj) {
                this.sex = obj.text;
                this.item.sex = obj.value;
            },

            openPicker() {
                this.$refs.picker.open();
            },

            confirmDate(val) {
                if (val) {
                    this.birthday = formatDate(val);
                    this.item.birthday = val.valueOf();
                }
            },

            startTimer() {
                let num = 60;
                let timer = this.$refs.timer;

                timer.innerHTML = num + 's';
                this.st = setInterval(() => {
                    num--;
                    if (num) {
                        timer.innerHTML = num + 's';
                    } else {
                        this.stopTimer();
                    }
                }, 1000);
            },

            stopTimer() {
                this.isSendCode = false;
                clearTimeout(this.st);
            },

            sendCode() { //eslint-disable-line consistent-return
                let phone = this.item.phone;

                if (!(/^1[34578]\d{9}$/.test(phone))) {
                    util.showMessage({
                        type: 'custom',
                        message: '手机号码有误',
                        duration: 1000
                    });
                    return false;
                }

                this.isSendCode = true;
                this.startTimer();

                //this.$http.get('/consultApi/consult-user/send-authcode', {
                this.$http.get('/baseApi/user/send-authcode', {
                    params: {
                        mobilePhone: phone
                    }
                }).then(
                        (response) => {
                            let res = response.data;

                            if (res.result === 0) {
                                util.showMessage({
                                    type: 'validateAlr',
                                    duration: 1000
                                });
                            } else {
                                if (res.code == -2009) {
                                    util.showMessage({
                                        message: '该手机号已注册',
                                        duration: 1000
                                    });
                                } else {
                                    util.showMessage({
                                        type: 'validateSendFai',
                                        duration: 1000
                                    });
                                }
                                this.stopTimer();
                            }
                        },
                        () => {
                            util.showMessage({
                                type: 'validateSendFai',
                                duration: 1000
                            });
                            this.stopTimer();
                        }
                );
            },

            next() { //eslint-disable-line consistent-return
                let code = this.item.code;
                let phone = this.item.phone;

                if (!(/^1[34578]\d{9}$/.test(phone))) {
                    util.showMessage({
                        type: 'custom',
                        message: '手机号码有误',
                        duration: 1000
                    });
                    return false;
                }

                if (!(/\d{6}/.test(code))) {
                    util.showMessage({
                        type: 'validateWro',
                        duration: 1000
                    });
                    return false;
                }

                Indicator.open();
                //this.$http.post('/consultApi/consult-user/check-authcode', {
                this.$http.post('/baseApi/user/check-authcode', {
                    mobilePhone: phone,
                    authCode: code
                }).then(
                        (response) => {
                            let res = response.data;
                            this.stopTimer();
                            Indicator.close();

                            if (res.result === 0) {
                                this.step = 2;
                                util.setTitle('完善个人信息');
                            } else {
                                util.showMessage({
                                    type: 'validateFai',
                                    duration: 1000
                                });
                            }
                        },
                        () => {
                            this.stopTimer();
                            Indicator.close();
                            util.showMessage({
                                type: 'validateFai',
                                duration: 1000
                            });
                        }
                );
            },

            confirm() {
                let item = this.item;

                this.disableConfirm = true;

                Indicator.open();
                this.$http.post('/baseApi/user/reg', {
                    userName: item.userName,
                    sex: +item.sex,
                    birthday: item.birthday,
                    mobilePhone: item.phone,
                    uniqueId: userAuth.getUserInfo('uniqueId')
                }).then(
                        (response) => {
                            let res = response.data;
                            Indicator.close();

                            if (res.result == 0) {
                                let data = res.data || {};

                                userAuth.update({
                                    isComplete: 1,
                                    userName: item.userName,
                                    birthday: item.birthday,
                                    mobilePhone: item.phone,
                                    sex: +item.sex,
                                    id: data.chronicdUserId,
                                    patientId: data.patientId,
                                    systemUserId: data.systemUserId
                                });

                                util.showMessage({
                                    type: 'saveSuc',
                                    duration: 1000
                                });

                                this.changeLocation();
                            } else {
                                this.disableConfirm = false;
                                util.showMessage({
                                    type: 'saveFai',
                                    duration: 1000
                                });
                            }
                        },
                        () => {
                            this.disableConfirm = false;
                            Indicator.close();
                            util.showMessage({
                                type: 'saveFai',
                                duration: 1000
                            });
                        }
                );
            },

            gotoDoctorDetail(chronicdDoctorId, patientId) {
                util.changeLocation({
                    changeTo: 'doctorDetail.html',
                    timeOut: 600,
                    query: {
                        chronicdDoctorId: chronicdDoctorId,
                        patientId: patientId
                    }
                });
            },

            changeLocation() {
                let chronicdDoctorId = util.getParams('chronicdDoctorId');
                let patientId = userAuth.getUserInfo('patientId');
                let url = util.getParams('historyPage');

                if (url) {
                    setTimeout(function () {
                        window.history.go(-1);
                    }, 600);
                    /*util.changeLocation({
                     changeTo: url,
                     timeOut: 600,
                     query: {
                     chronicdDoctorId: chronicdDoctorId
                     }
                     });*/
                } else {
                    if (chronicdDoctorId) {
                        this.$http.get('/baseApi/consult-conversation/conversation-id', {
                            params: {
                                chronicdDoctorId: chronicdDoctorId,
                                patientId: patientId
                            }
                        }).then(
                                (response) => {
                                    let res = response.data;
                                    if (res.result == 0) {
                                        util.changeLocation({
                                            changeTo: 'im/index.html',
                                            timeOut: 600,
                                            query: {
                                                roleCode: 1,
                                                consultConversationId: res.data.consultConversationId
                                            }
                                        });
                                    } else {
                                        this.gotoDoctorDetail(chronicdDoctorId, patientId);
                                    }
                                },
                                () => {
                                    this.gotoDoctorDetail(chronicdDoctorId, patientId);
                                }
                        );
                    } else {
                        util.windowClose();
                    }
                }
            }
        }
    };
</script>
