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
            <mt-button @click.native="save" type="primary" size="large" :disabled="!(item.occurredTime && item.medicalType && item.medicalInstitutions && item.medicalInfo && !disableSave)">保存诊疗记录</mt-button>
        </div>

        <select-picker :selected-value="selectedMedicalType" :options="slots" ref="medicalType"
                       @confirm="confirm"></select-picker>


        <mt-datetime-picker ref="dateVisible" type="date" :start-date="startDate" :end-date="endDate"
                            year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
                            v-model="occurredTime" @confirm="handleChange"></mt-datetime-picker>

    </div>

</template>

<script lang="babel">
import {Indicator} from 'mint-ui';
import format from '../../common/format';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

export default {
    name: 'app',
    data() {
        return {
            disableSave: false,
            dateVisible: false,
            occurredTime: new Date(),
            startDate: new Date('1900/01/01'),
            endDate: new Date(),

            item: {
                occurredTime: '',
                medicalType: null,
                medicalInstitutions: '',
                medicalInfo: '',
                attachments: []
            },

            selectedMedicalType: '1',
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

    created() {
        this.item.occurredTime = format.formatDate(this.occurredTime, 'yyyy.MM.dd');
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

        //保存
        save: function () {
            this.disableSave = true;
            Indicator.open();

            let params = {
                patientId: userAuth.getUserInfo('patientId'),
                occurredTime: this.occurredTime.valueOf(),
                medicalType: this.item.medicalType,
                medicalInstitutions: this.item.medicalInstitutions,
                medicalInfo: this.item.medicalInfo,
                attachments: this.item.attachments
            };

            //http://localhost:8080/chronicd-server-api/v1/medicalrecord/add
            this.$http.post('/baseApi/medicalrecord/add', params).then(
                (response) => {
                    let res = response.data;
                    this.disableSave = false;
                    Indicator.close();

                    if (res.result === 0) {
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
        }
    }
};

</script>

<style lang="less">
    @import "../../assets/css/common.less";

    #app {
        .section {
            .top, .bottom {
                padding: 0.2rem 0.4rem;
                background: @white;
            }
            .top {
                color: @textColorBlack;
                font-size: @fontSizeBase;
            }
            .bottom {
                padding: 0 0.4rem 0.2rem 0.4rem;
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
        .mint-cell-wrapper {
            font-size: 0.32rem;
        }
        .mint-field {
            .mint-cell-title {
                width: 2.1rem;
            }
        }
        .bottom > span {
            padding: 0 0.16rem 0.16rem 0;
            height: 1.6rem;
        }
    }
    .mint-field.is-textarea .mint-cell-title {
        padding: 0.2rem 0;
    }

    .mint-button {
        font-size: 0.32rem;
        border-radius: 0.08rem;
    }
</style>
