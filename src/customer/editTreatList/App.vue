<template>
    <div id="app" class="foot-fixed">
        <div class="section">
            <mt-field label="诊疗分类" placeholder="请选择" v-model="medicalText" @click.native="checkShow('medicalType')"
                      readonly>
                <span class="left">
                    <img class="arrow-right" src="../../assets/img/more.png">
                </span>

            </mt-field>

            <mt-field label="发生时间" placeholder="请选择" v-model="item.occurredTime"
                      @click.native="checkShow('dateVisible')" readonly>
                <span class="left">
                    <img class="arrow-right" src="../../assets/img/more.png">
                </span>

            </mt-field>

            <mt-field label="诊疗机构" placeholder="请填写" v-model.trim="item.medicalInstitutions" :attr="{maxlength:100}"></mt-field>
        </div>

        <div class="section">
            <mt-field label="诊疗资料" placeholder="请填写病情、检查结果、手术记录等信息" type="textarea" v-model.trim="item.medicalInfo"
                      rows="4" :attr="{maxlength:200}"></mt-field>
        </div>

        <div class="section">
            <div class="top" v-text="'图片资料（门诊病历、检验检查单、处方等）'"></div>
            <imgupload :files="item.attachments" :maxlength=1></imgupload>
        </div>

        <div class="foot">
            <div>
                <mt-button @click.native="openConfirm" type="primary" size="large" plain>删除</mt-button>
            </div>
            <div>
                <mt-button @click.native="save" type="primary" size="large"
                           :disabled="!(item.occurredTime && item.medicalType && item.medicalInstitutions && item.medicalInfo && !disableSave)">
                    保存诊疗记录
                </mt-button>
            </div>
        </div>

        <select-picker :selected-value="selectedMedicalType" :options="slots" ref="medicalType"
                       @confirm="confirm"></select-picker>


        <mt-datetime-picker ref="dateVisible" type="date" :start-date="startDate" :end-date="endDate"
                            year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
                            v-model="occurredTime" @confirm="handleChange"></mt-datetime-picker>

    </div>

</template>

<script lang="babel">
import {Indicator,MessageBox} from 'mint-ui';
import format from '../../common/format';
import util from '../../common/util';
import userAuth from '../../common/userAuth'; //eslint-disable-line no-unused-vars

let medicalRecordId = util.getParams('id');

export default {
    name: 'app',
    data() {
        return {
            disableSave: false,
            dateVisible: false,
            occurredTime: null,
            startDate: new Date('1900/01/01'),
            endDate: new Date(),
            item: {
                occurredTime: '',
                medicalType: null,
                medicalInstitutions: '',
                medicalInfo: '',
                attachments: []
            },

            selectedMedicalType: '2',
            medicalText: null,
            //1-首诊 2-复诊 3-手术 4-住院 5-出院 6-会诊 9-其他
            slots: [
                { value: 1, text: '首诊'},
                { value: 2, text: '复诊'},
                { value: 3, text: '手术'},
                { value: 4, text: '住院'},
                { value: 5, text: '出院'},
                { value: 6, text: '会诊'},
                { value: 9, text: '其他'}
            ]
        };
    },
    methods: {
        //选择诊疗类型
        confirm: function (obj) {
            this.medicalText = obj.text;
            this.item.medicalType = obj.value;
        },

        //底部时间选择弹框显示
        checkShow(val) {
            this.$refs[val].visible = true;
        },

        //时间选择控件
        handleChange(value) {
            this.item.occurredTime = format.formatDate(value, 'yyyy.MM.dd');
        },

        //打开confirm确认框
        openConfirm: function () {
            MessageBox({
                title: '温馨提示',
                message: '确认删除本条记录吗？删除后不能恢复',
                confirmButtonText: '我要删除',
                confirmButtonClass: '',
                cancelButtonText: '放弃删除',
                cancelButtonClass: '',
                showCancelButton: true
            }).then((action) => {
                if (action == 'confirm') {
                    this.remove();
                }
            });
        },

        //删除诊疗记录
        remove: function () {
            this.disableSave = true;
            Indicator.open();

            //http://localhost:8080/chronicd-server-api/v1/medicalrecord/delete
            this.$http.post('/baseApi/medicalrecord/delete', {
                medicalRecordId: medicalRecordId
            }).then(
                (response) => {
                    let res = response.data;
                    this.disableSave = false;
                    Indicator.close();

                    if (res.result === 0 ) {
                        this.id = res.data;
                        util.showMessage({
                            type: 'deleteSuc',
                            duration: 1000
                        });
                        util.changeLocation({
                            changeTo: 'checkTreatList.html',
                            timeOut: 600
                        });
                    } else {
                        util.showMessage({
                            type: 'deleteFai',
                            duration: 1000
                        });
                    }
                },
                () => {
                    this.disableSave = false;
                    Indicator.close();
                    util.showMessage({
                        type: 'deleteFai',
                        duration: 1000
                    });
                }
            );
        },

        //更新诊疗记录
        save: function () {
            this.disableSave = true;
            Indicator.open();

            let params = {
                medicalRecordId: medicalRecordId,
                occurredTime: this.occurredTime.valueOf(),
                medicalType: this.item.medicalType,
                medicalInstitutions: this.item.medicalInstitutions,
                medicalInfo: this.item.medicalInfo,
                attachments: this.item.attachments
            };

            //http://localhost:8080/chronicd-server-api/v1//medicalrecord/update
            this.$http.post('/baseApi/medicalrecord/update', params).then(
                (response) => {
                    let res = response.data;
                    this.disableSave = false;
                    Indicator.close();

                    if (res.result === 0 ) {
                        this.id = res.data;
                        util.showMessage({
                            type: 'saveSuc',
                            duration: 1000
                        });
                        util.changeLocation({
                            changeTo: 'checkTreatList.html',
                            timeOut: 600
                        });
                    } else {
                        util.showMessage({
                            type: 'saveFai',
                            duration: 1000
                        });
                    }
                },
                () => {
                    this.disableSave = false;
                    Indicator.close();
                    util.showMessage({
                        type: 'saveFai',
                        duration: 1000
                    });
                }
            );
        },

        //格式化页面数据显示
        formatData: function () {
            this.medicalText = (this.slots.find((item) => {
                return item.value == this.item.medicalType;
            }) || {}).text;

            this.occurredTime = new Date(this.item.occurredTime);

            this.item.occurredTime = format.formatDate(this.item.occurredTime, 'yyyy.MM.dd');
        },

        //获取数据请求
        getData() {
            Indicator.open();
            //this.disableSave = true;

            //medicalrecord/detail?medicalRecordId=1
            this.$http.get('/baseApi/medicalrecord/detail', {
                params: {
                    medicalRecordId: medicalRecordId
                }
            }).then(
                (response) => {
                    Indicator.close();

                    let res = response.data;
                    if (res.result === 0) {
                        this.item = res.data;

                        //格式化页面数据显示
                        this.formatData();
                        this.disableSave = false;
                    } else {
                        util.showMessage({
                            type: 'loadFai',
                            duration: 1000
                        });
                    }
                },

                (response) => { //eslint-disable-line no-unused-vars
                    util.showMessage({
                        type: 'loadFai',
                        duration: 1000
                    });
                    Indicator.close();
                }
            );
        }
    },

  //初始化请求
    mounted() {
        this.getData();
    }
};
</script>

<style lang="less">
    @import "../../assets/css/common.less";

    #app {
        .section {
            .top, .bottom {
                padding: 10px 20px;
                background: @white;
            }
            .top {
                color: @textColorBlack;
                font-size: @fontSizeBase;
            }

        }

        .foot > div {
            float: left;
            width: 50%;

            &:first-child {
                padding-right: @gap;
            }

            &:last-child {
                padding-left: @gap;
            }
        }

        .mint-popup {
            width: 100%;
        }

        .mint-field-other {
            position: relative;

            .left {
                display: flex;
                line-height: 1.6;
            }
        }
    }
    #app {
        .mint-cell {
            min-height: 0.96rem;
        }
        .section {
            .bottom, .top {
                padding: 0.2rem 0.4rem;
            }
        }
    }
    .mint-field .mint-cell-title {
        width: 2.1rem;
    }
    .mint-field.is-textarea .mint-cell-title {
        padding: 0.2rem 0;
    }
    .bottom span.addPicture {
        padding: 0.08rem 0.16rem 0.08rem 0;
        height: 1.6rem;
    }
    .mint-msgbox {
        .mint-msgbox-header {
            padding: 0.4rem 0 0;
        }
        .mint-msgbox-message {
            line-height: 0.42rem;
        }
    }
</style>
