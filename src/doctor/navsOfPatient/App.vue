<template>
    <div id="app" :class="{hideNav: accessFromApp}">
        <div class="nav" v-if="!accessFromApp">
            <a href="javascript: void(0)" @click="goToConversation"><span>患者对话</span></a>
            <a href="javascript: void(0)" class="active"><span>患者资料</span></a>
        </div>

        <div class="section">
            <div class="patient-info">
                <span class="left">
                    <span class="circle border">
                        <img :src="patient.head || defaultHead">
                    </span>
                </span>

                <span class="middle">
                    <p class="name">
                        <span v-text="patient.realName"></span>
                        <img src="../../assets/img/icon-male.png" v-show="patient.sex==0">
                        <img src="../../assets/img/icon-female.png" v-show="patient.sex==1">
                    </p>
                    <p class="age" v-text="patient.age"></p>
                </span>

                <span class="right">
                    <a href="javascript:void(0)" @click="checkDetail($event, 'moreBasis')"><span>更多基本信息</span><img
                            class="arrow-right" src="../../assets/img/more.png"></a>
                </span>
            </div>
        </div>

        <div class="section">
            <mt-cell title="备注" @click.native="checkDetail($event, 'tag')">
                <span class="text tag" v-text="tags"></span>
                <img class="arrow-right" src="../../assets/img/more.png">
            </mt-cell>
            <mt-cell title="患者随访计划" @click.native="checkDetail($event, 'followUp')">
                <span class="text" v-text="followUpText"></span>
                <img class="arrow-right" src="../../assets/img/more.png">
            </mt-cell>
            <mt-cell title="患者置顶">
                <mt-switch v-model="top" @change="setTop"></mt-switch>
            </mt-cell>
            <mt-cell title="患者血压记录" @click.native="checkDetail($event, 'bloodPressure')">
                <img class="arrow-right" src="../../assets/img/more.png">
            </mt-cell>
            <mt-cell title="患者血糖记录" @click.native="checkDetail($event, 'bloodSugar')">
                <img class="arrow-right" src="../../assets/img/more.png">
            </mt-cell>
        </div>

        <div class="section">
            <mt-cell title="诊疗记录" @click.native="checkDetail($event, 'treat')">
                <span class="text" v-show="items.length>0">全部</span>
                <img class="arrow-right" src="../../assets/img/more.png">
            </mt-cell>
            <mt-cell class="full">
                <div v-show="items.length>0">
                    <ul class="list">
                        <li v-for="item in items">
                            <div class="top">
                                <span class="left">
                                    <p>
                                        <span class="time" v-text="item.date"></span>
                                        <span class="part" v-text="item.medicalText"></span>
                                    </p>
                                    <p class="part" v-text="item.medicalInstitutions"></p>
                                </span>
                            </div>
                            <div class="middle">
                                <p v-text="item.medicalInfo"></p>
                            </div>
                            <div class="bottom">
                                <span v-for="(url,index) in item.attachments">
                                    <img :src="url+'?x-oss-process=image/resize,m_fixed,h_80,w_80'"
                                         @click="picPreview(item.attachments,index)">
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="empty" v-show="items.length<=0">
                    <p>诊疗记录会显示患者自行添加的记录内容</p>
                </div>
            </mt-cell>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        padding-top: 0;
        -webkit-overflow-scrolling: touch;
    }

    .nav {
        background: #ffffff;
        box-shadow: 0px 0.04rem 0.08rem 0px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        position: relative;

        &:after {
            content: '';
            position: absolute;
            display: block;
            width: 1px;
            height: 0.36rem;
            left: 50%;
            top: 50%;
            margin-top: -0.18rem;
            background: @borderColor;
        }

        a {
            position: relative;
            float: left;
            display: inline-block;
            width: 50%;
            height: 50px;
            line-height: 1rem;
            text-align: center;
            font-size: @fontSizeBase;
            color: @textColorBase;
            text-decoration: none;
            &.active {
                border-bottom: 2px solid @blue;
            }
            span {
                position: relative;
                height: 100%;
                display: inline-block;
                padding: 0 0.1rem;
            }

            &.active {
                color: @blue;
                span:after {
                    content: '';
                    position: absolute;
                    display: block;
                    height: 0.04rem;
                    width: 100%;
                    left: 0;
                    bottom: 0;
                }
            }
        }
    }

    .mint-cell-value {
        .text {
            line-height: 1.6;
            font-size: @fontSizeBase;
            color: @textColorLight;
        }

        .tag {
            overflow: hidden;
            text-overflow: ellipsis;
            width: 4.2rem;
            text-align: right;
            white-space: nowrap;
        }
    }

    .hideNav .section {
        &:first-child {
            margin-top: 0.1rem;
        }
    }

    .patient-info {
        background: #fff;
        font-size: 0;
        padding: 0.4rem;
        display: flex;
        align-items: center;

        .circle {
            width: 1.28rem;
            height: 1.28rem;
            background: #eee;
            &.border {
                border: 2px solid rgba(154, 157, 167, 0.11);
            }
        }

        .left {
            display: block;
            width: 1.68rem;
        }

        .middle {
            flex: 1;
            overflow: hidden;
            display: block;

            .name {
                font-size: @fontSizeBase;
                color: @textColorBlack;

                img {
                    height: 0.32rem;
                    vertical-align: -0.04rem;
                    margin-left: 0.2rem;
                }
            }

            .age {
                font-size: @fontSizeSm;
                color: @textColorBase;
            }
        }

        .right {
            width: 2.08rem;
            text-align: right;
            display: block;

            a {
                font-size: @fontSizeSm;
                color: @blue;
                text-decoration: none;
                display: block;
                height: 0.28rem;
                line-height: 0.28rem;

                img {
                    height: 0.23rem;
                    margin-left: 0.2rem;
                    vertical-align: -0.02rem;
                }
            }
        }
    }

    .full {
        .mint-cell-title {
            flex: 0;
        }

        .mint-cell-value {
            display: block;
            width: 100%;
        }
    }

    .empty {
        p {
            padding: 0.6rem 0;
            font-size: @fontSizeXs;
            color: @textColorLight;
            text-align: center;
        }
    }

    .list {
        padding: 0.32rem 0;
        margin-top: 1px;

        li {
            background: @white;
            margin-top: @gap;
            border: 1px solid @borderColor;
            border-radius: 0.08rem;

            &:first-child {
                margin-top: 0;
            }
            & > div {
                padding: 0.32rem 0.4rem;
            }
        }
        .top {
            display: flex;
            background: #f4fcfd;
            align-items: center;
            box-shadow: 0px 0.02rem 0.06rem 0px rgba(0, 0, 0, 0.05);

            .left {
                flex: 1;
                .time {
                    color: @textColorBlack;
                    font-size: @fontSizeBase;
                    padding-right: 0.2rem;
                }
                .part {
                    color: @textColorBase;
                    font-size: @fontSizeXs;
                }
                p.part {
                    padding-top: 0.16rem;
                }
            }
            .right {
                width: 0.5rem;
                img {
                    width: 0.5rem;
                }

            }
        }

        .middle {
            p {
                line-height: 1.5;
            }
        }

        .bottom {
            padding-top: 0;
            overflow: hidden;
            & > span {
                width: 25%;
                padding: 0.08rem 0.16rem 0.08rem 0;
                display: inline-block;
                float: left;
                text-align: left;
                height: 1.6rem;
                position: relative;
            }

            img {
                height: 100%;
            }

        }
    }

    .nav a {
        height: 1rem;
    }

    .mint-cell {
        min-height: 0.96rem;
        .mint-cell-value {
            .arrow-right {
                margin-left: 0.3rem;
                vertical-align: baseline;
            }
        }
    }

    .mint-switch-core {
        width: 1.04rem;
        height: 0.64rem;
        border-radius: 0.32rem;
        &::before {
            width: 1rem;
            height: 0.6rem;
            border-radius: 0.3rem;
        }
        &::after {
            width: 0.6rem;
            height: 0.6rem;
            border-radius: 0.3rem;
        }
    }

    .fixDialog {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 1);
        z-index: 1000;

        .fixLeft {
            position: absolute;
            left: 0;
            z-index: 1000;
        }
        .fixRight {
            position: absolute;
            right: 0;
            z-index: 1000;
        }
        .fixBottom {
            position: absolute;
            left: 0;
            right: 0;
            max-width: 100%;
            max-height: 100%;
            z-index: 100;
        }
        img {
            top: 0;
            bottom: 0;
            margin: auto;
        }
    }
</style>

<script lang="babel">
    import {Indicator} from 'mint-ui';
    import util from '../../common/util';
    import format from '../../common/format';
    import global from '../../common/global';
    import native from '../../common/native';
    import doctorAuth from '../../common/doctorAuth';

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd');
    }

    let medicalTypeList = ['首诊', '复诊', '手术', '住院', '出院', '会诊', '其他'];
    let st;

    export default {
        name: 'app',
        data() {
            return {
                defaultHead: require('../../assets/img/head-patient.png'), //eslint-disable-line no-undef
                accessFromApp: true,
                top: false,
                patient: {},
                followCount: null,
                followUpText: null,
                tags: '无',
                tagIds: [],
                items: [],
                patientId: '',
                doctorId: '',
                consultConversationId: ''
            };
        },
        methods: {
            goToConversation() {
                util.changeLocation({
                    changeTo: 'im/index.html',
                    timeOut: 600,
                    query: {
                        roleCode: 0,
                        consultConversationId: this.consultConversationId
                    }
                });
            },

            checkDetail($event, type) {
                let patientId = this.patientId;
                let patient = this.patient || {};

                let obj = {
                    moreBasis: 'infoOfPatient.html',
                    tag: 'addTagForPatient.html',
                    followUp: 'followUpOfPatient.html',
                    bloodPressure: 'bloodPressureOfPatient.html',
                    bloodSugar: 'bloodSugarOfPatient.html',
                    treat: 'treatListOfPatient.html'
                };

                if (obj[type]) {
                    let url = `${obj[type]}?patientId=${patientId}`;

                    if (patient.realName) {
                        url += `&patientName=${patient.realName}`;
                    }

                    util.changeLocation({
                        changeTo: url,
                        type: 0
                    });
                }
            },

            setTop() {
                let isAssign = this.top;
                clearTimeout(st);
                st = setTimeout(() => {
                    this.$http.post('/baseApi/doctor-patient/assign', {
                        patientId: this.patientId,
                        chronicdDoctorId: this.doctorId,
                        isAssign: isAssign ? 1 : 0
                    }).then(() => {
                        if (this.accessFromApp) {
                            native.topFunc(isAssign);
                        }
                    });
                }, 600);
            },

            setTreat(list) {
                let items = this.items;
                let item;

                for (let i = 0; i < list.length; i++) {
                    item = list[i];
                    item.date = formatDate(item.occurredTime);
                    item.medicalText = medicalTypeList[item.medicalType - 1];
                    items.push(item);
                }
            },

            setRemarks(list) {
                let tags = [];
                let ids = [];
                let item;

                for (let i = 0; i < list.length; i++) {
                    item = list[i];
                    if (item.tagName != null && item.tagName != undefined) { //eslint-disable-line no-eq-null, no-undefined
                        tags.push(item.tagName);
                    }

                    ids.push(item.tagId);
                }

                this.tagIds = ids;
                this.tags = tags.length > 0 ? tags.join('/') : '无';
            },

            getData() {
                Indicator.open();

                this.$http.get('/baseApi/doctor-patient/patient-basic', {
                    params: {
                        patientId: this.patientId,
                        chronicdDoctorId: this.doctorId
                    }
                }).then(
                    (response) => {
                        Indicator.close();

                        let res = response.data;

                        if (res.result == 0) {
                            let data = res.data;
                            this.patient = data.patient;
                            this.patient.age = format.formatAge(data.patient.birthday);
                            this.top = data.assignFlag == 1;
                            this.followCount = data.followCount;
                            this.followUpText = data.followCount > 0 ? ('随访中 ' + data.followCount) : '无';
                            this.setTreat(data.results || []);
                            this.setRemarks(data.patientTags || []);
                            this.consultConversationId = data.consultConversationId;
                        } else {
                            util.showMessage({
                                type: 'loadFai',
                                duration: 1000
                            });
                        }
                    },

                    (response) => { //eslint-disable-line no-unused-vars
                        Indicator.close();
                        util.showMessage({
                            type: 'loadFai',
                            duration: 1000
                        });
                    }
                );
            },

            picPreview(pics, index) {
                if (typeof WeixinJSBridge == 'undefined') {
                    this.pictureZoom(pics,index);
                } else {
                    WeixinJSBridge.invoke('imagePreview', { //eslint-disable-line no-undef
                        'current': pics[index],
                        'urls': pics
                    });
                }
            },

            //非微信端图片放大功能
            pictureZoom(pics,index) {
                let ind = index;
                var dom = document.createElement('div');
                dom.className = 'fixDialog';

                dom.innerHTML = '<span><img class="fixLeft" src="../src/assets/img/previous.png" /><img class="fixBottom" src="' + pics[ind] + '?x-oss-process=image/resize,w_1920/auto-orient,1" /><img class="fixRight" src="../src/assets/img/next.png" /></span>';
                document.body.appendChild(dom);

                var obj = document.getElementsByClassName('fixBottom')[0];
                obj.onclick = function () {
                    document.getElementsByClassName('fixDialog')[0].remove();
                };


                var left = document.getElementsByClassName('fixLeft')[0];
                //上一张
                left.onclick = function () {
                    ind--;
                    if (ind < 0) {
                        ind = pics.length - 1;
                    }
                    obj.src = pics[ind] + '?x-oss-process=image/resize,w_1920/auto-orient,1';
                };

                var right = document.getElementsByClassName('fixRight')[0];
                //下一张
                right.onclick = function () {
                    ind++;
                    if (ind == pics.length) {
                        ind = 0;
                    }
                    obj.src = pics[ind] + '?x-oss-process=image/resize,w_1920/auto-orient,1';
                };
            }
        },

        mounted() {
            this.accessFromApp = global.getConfig().accessFromApp;
            this.patientId = util.getParams('patientId');
            this.doctorId = doctorAuth.getDoctorId();
            this.getData();
        }
    };
</script>
