<template>
    <div id="app" class="foot-fixed">
        <div>
            <div class="section">
                <mt-cell class="template">
                    <div class="container">
                        <div class="name" v-text="templateName"></div>
                        <!--<div class="remind" v-text="doctorName+'医生提醒您'"></div>-->
                        <div class="time" v-show="startTime"><span>开始时间：</span><span v-text="startTime"></span></div>
                    </div>
                </mt-cell>
            </div>

            <div class="section">
                <div class="timeLine">
                    <mt-cell v-for="record in records">
                        <div class="container">
                            <div class="time-point"></div>
                            <div class="time-text">
                                <span v-text="record.sendPointText" class="sendPoint"></span>
                                <span v-text="record.period" class="period"></span>
                                <span v-text="'（'+record.sendDateText+'）'" class="date"></span>
                            </div>

                            <div class="time-remind">
                                <span v-text="record.remindText + '：'"></span><span v-text="record.context"></span>
                            </div>
                        </div>
                    </mt-cell>
                </div>
            </div>

            <div class="foot" v-if="doctorId || consultConversationId">
                <mt-button @click.native="contact" type="primary" size="large">
                    联系{{doctorName}}医生
                </mt-button>
            </div>
        </div>

        <div class="blank" v-show="isShowBlank">
            <div>
                <img src="../../assets/img/blank-followup.png">
                <h3>
                    随访计划不存在或已删除
                </h3>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        -webkit-overflow-scrolling: touch;

        & > div {
            padding-bottom: 1.56rem;
        }

        &.foot-fixed {
            bottom: 0;
            z-index: 1;
            overflow-y: inherit;

            .foot {
                z-index: 10;
            }
        }

        .section {
            &:first-child {
                margin-top: 0;
            }
        }

        .template {
            .mint-cell-title {
                flex: 0;
            }

            .container{
                padding: 0.4rem 0;
            }

            .name {
                font-size: @fontSizeBase;
                color: @textColorBlack;
                line-height: 1.5;
            }

            .remind{
                margin-top: 0.2rem;
                font-size: @fontSizeSm;
                color: #939393;
            }
            .time {
                margin-top: .2rem;
                font-size: @fontSizeSm;
                color: #939393;
            }
        }

        .timeLine {
            position: relative;

            .mint-cell-wrapper {
                padding: 0 0.4rem 0 1rem;
            }

            .mint-cell-title {
                flex: 0
            }

            .mint-cell-value {
                display: block;
                width: 100%;
            }

            .container {
                position: relative;
                padding: 0.4rem 0;

                &:after {
                    content: '';
                    display: block;
                    position: absolute;
                    width: 1px;
                    background-size: 1px 100%;
                    background-repeat: no-repeat;
                    background-position: top left;
                    background-image: linear-gradient(90deg,  @blue,  @blue  50%, transparent 50%);
                    top:0;
                    bottom: 0;
                    left: -0.5rem;
                }
            }

            .mint-cell:first-child{
                .container:after{
                    top: 0.5rem;
                }
            }

            .mint-cell:last-child{
                .container:after{
                    height: 0.5rem;
                }
            }

            .time-point {
                width: 0.2rem;
                height: 0.2rem;
                position: absolute;
                background: @blue;
                border-radius: 100%;
                left: -0.6rem;
                top: 0.44rem;
            }

            .time-text {
                font-size: 0;

                span {
                    font-size: @fontSizeBase;
                    color: @textColorBlack;
                }

                .period {
                    margin-right: 0.2rem;
                }
            }

            .time-remind {
                line-height: 1.5;
                margin-top: 0.16rem;
                font-size: @fontSizeXs;
                color: @textColorLight;
            }
        }
    }

    #app {
        .mint-cell {
            min-height: 0.96rem;
        }
        .top {
            .mint-cell-title {
                padding: 0.3rem 0;
            }
        }
        .bottom {
            .doctor {
                .name {
                    margin-right: 0.2rem;
                }
                .divider {
                    margin: 0 0.04rem;
                }
            }
        }
    }
</style>

<script lang="babel">
    import { Indicator} from 'mint-ui';
    import format from '../../common/format';
    import util from '../../common/util';
    import userAuth from '../../common/userAuth';

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd');
    }

    export default {
        name: 'app',
        data() {
            return {
                isShowBlank: false,
                disableBtn: true,
                templateInfo: null,
                templateName: null,
                doctorName: null,
                doctorId: null,
                startTime: null,
                consultConversationId: null,
                records: []
            };
        },

        methods: {
            contact() {
                if (this.consultConversationId) {
                    this.goConversation(this.consultConversationId);
                } else {
                    Indicator.open();

                    this.$http.get('/baseApi/patient-chronicd-consult/consult-list', {
                        params: {
                            consultDoctorId: this.doctorId,
                            patientId: userAuth.getUserInfo('patientId'),
                            curr: 1,
                            size: 1
                        }
                    }).then(
                        (response) => {
                            Indicator.close();
                            let res = response.data;
                            if (res.result == 0) {
                                let list = (res.data || {}).results || [];

                                if (list.length > 0) {
                                    this.goConversation(list[0].consultConversationId);
                                }
                            }
                        },

                        () => {
                            Indicator.close();
                        }
                    );
                }
            },

            goConversation(consultConversationId) {
                util.changeLocation({
                    changeTo: 'im/index.html',
                    timeOut: 600,
                    query: {
                        consultConversationId: consultConversationId,
                        roleCode: 1
                    }
                });
            },

            initPlan(list) {
                let records = this.records;
                let record;

                for (let i = 0; i < list.length; i++) {
                    record = list[i];

                    if (i == 0) {
                        this.startTime = formatDate(record.sendPointDate);
                    }

                    record.remindText = format.formatRemind(record.remindType);
                    record.sendPointText = format.formatSendPoint(record.sendPointType);
                    record.period = format.formatSendPeriod(record.intervalDateType, record.intervalDays);
                    record.sendDateText = formatDate(record.sendPointDate);
                    record.context = record.context.length > 0 ? record.context : '无';

                    records.push(record);
                }
            },

            deletePlan() {

            }
        },

        mounted() {
            let id = util.getParams('planTemplateId');

            this.consultConversationId = util.getParams('consultConversationId');
            this.doctorId = util.getParams('doctorId');

            Indicator.open();
            this.$http.get('/baseApi/patient-follow-up/plan-detail', {
                params: {
                    id: id
                }
            }).then(
                (response) => {
                    let res = response.data;

                    if (res.result === 0) {
                        let templateInfo = res.data.template;

                        if (templateInfo.deleteFlag == 1) {
                            this.isShowBlank = true;
                        } else {
                            this.disableBtn = false;
                            this.templateInfo = templateInfo;
                            this.templateName = templateInfo.templateName;
                            this.doctorName = decodeURIComponent(util.getParams('doctorName'));
                            this.initPlan(res.data.records);
                        }
                    }

                    Indicator.close();
                },
                (response) => { //eslint-disable-line no-unused-vars
                    Indicator.close();
                }
            );
        }
    };
</script>
