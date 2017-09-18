<template>
    <div id="app" class="foot-fixed">
       <div>
           <div class="section">
               <mt-cell class="template">
                   <div class="name" v-text="templateName"></div>
                   <div class="time" v-show="startTime"><span>开始时间：</span><span v-text="startTime"></span></div>
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

           <div class="foot">
               <mt-button @click.native="deletePlan" type="primary" size="large" :disabled="disableBtn">
                   删除随访计划
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

    .mint-msgbox .mint-msgbox-message {
        line-height: 0.42rem;
    }

    .mint-msgbox .mint-msgbox-header {
        padding: 0.4rem 0 0;
    }

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
            .mint-cell-wrapper {
                padding: .4rem;
            }

            .mint-cell-title {
                flex: 0;
            }

            .mint-cell-value {
                display: block;
            }

            .name {
                font-size: @fontSizeBase;
                color: @textColorBlack;
                line-height: 1.5;
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
                margin-top: 0.16rem;
                font-size: @fontSizeXs;
                color: @textColorLight;
                line-height: 1.5;
            }
        }
    }
</style>

<script lang="babel">
    import {Indicator, MessageBox} from 'mint-ui';
    import format from '../../common/format';
    import util from '../../common/util';
    import doctorAuth from '../../common/doctorAuth';

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd');
    }

    export default {
        name: 'app',
        data() {
            return {
                isShowBlank: false,
                patientId: '',
                doctorId: '',

                disableBtn: true,
                templateInfo: null,
                templateName: null,
                startTime: null,

                records: []
            };
        },

        methods: {
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

            deletePlan: function () {
                MessageBox({
                    title: '温馨提示',
                    message: '确认删除该随访计划吗？删除后不能恢复',
                    confirmButtonText: '我要删除',
                    confirmButtonClass: '',
                    cancelButtonText: '放弃删除',
                    cancelButtonClass: '',
                    showCancelButton: true
                }).then((action) => {
                    if (action == 'confirm') {
                        this._deletePlan(); //eslint-disable-line no-underscore-dangle
                    }
                });
            },

            _deletePlan() {
                let id = util.getParams('id');

                Indicator.open();
                this.disableBtn = true;
                this.$http.get('/baseApi/doctor-follow-up/plan-delete', {
                    params: {
                        id: id
                    }
                }).then(
                    (response) => {
                        let res = response.data;
                        Indicator.close();
                        if (res.result === 0) {
                            util.showMessage({
                                type: 'deleteSuc',
                                duration: 1000
                            });
                            util.changeLocation({
                                changeTo: 'followUpOfPatient.html',
                                timeOut: 600,
                                query: {
                                    patientId: this.patientId,
                                    patientName: util.getParams('patientName'),
                                    device: util.getParams('device'),
                                    chronicdDoctorId: this.doctorId
                                },
                                currWin: true
                            });
                        } else {
                            this.disableBtn = false;
                            util.showMessage({
                                type: 'deleteFai',
                                duration: 1000
                            });
                        }
                    },
                    (response) => { //eslint-disable-line no-unused-vars
                        this.disableBtn = false;
                        Indicator.close();
                        util.showMessage({
                            type: 'deleteFai',
                            duration: 1000
                        });
                    }
                );
            }
        },

        created() {
            this.patientId = util.getParams('patientId');

            util.setTitleByPatient(this.patientId, {
                success: '{{patient}}的随访计划详情',
                fail: '患者随访计划详情'
            });
        },

        mounted() {
            let id = util.getParams('id');

            this.doctorId = doctorAuth.getDoctorId();

            Indicator.open();
            this.$http.get('/baseApi/doctor-follow-up/plan-detail', {
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
                            util.changeLocation({
                                changeTo: 'navsOfPatient.html',
                                timeOut: 600,
                                query: {
                                    patientId: this.patientId
                                },
                                currWin: true
                            });
                        } else {
                            this.disableBtn = false;
                            this.templateInfo = templateInfo;
                            this.templateName = templateInfo.templateName;
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
