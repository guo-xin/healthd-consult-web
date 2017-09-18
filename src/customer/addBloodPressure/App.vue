<template>
    <div id="app" class="foot-fixed">
        <div class="section">
            <mt-datetime-picker
                    ref="picker"
                    v-model="item.measurementTime"
                    :endDate="endDate"
                    @confirm="confirmDate">
            </mt-datetime-picker>

            <mt-cell class="no-border" title="测量时间">
                <span class="field-text" @click="openPicker" v-text="date"></span><img class="arrow-right"
                                                                                       src="../../assets/img/more.png">
            </mt-cell>
        </div>

        <div class="section">
            <mt-field class="unit" label="低压（舒张压）" placeholder="请填写" v-model.trim="item.lowPressure" type="number"
                      :attr="{ maxlength: 3 }">
                <span>mmHg</span></mt-field>
            <mt-field class="unit" label="高压（收缩压）" placeholder="请填写" v-model.trim="item.highPressure" type="number"
                      :attr="{ maxlength: 3 }"><span>mmHg</span>
            </mt-field>
            <mt-field class="unit" label="心率（选填）" placeholder="请填写" v-model.trim="item.heartRate" type="tel"
                      :attr="{ maxlength: 3 }">
                <span>bpm</span></mt-field>
        </div>

        <div class="section">
            <mt-field label="服药情况（选填）" placeholder="如：安泰地坪 5毫克 口服 一日1次" type="textarea" rows="4"
                      v-model.trim="item.medicineCondition" :attr="{ maxlength: 200 }"></mt-field>
        </div>

        <div class="section">
            <mt-field label="备注（选填）" placeholder="如：月经、劳累、情绪变化、血糖低等情况" type="textarea" rows="4"
                      v-model.trim="item.remark"
                      :attr="{ maxlength: 200 }"></mt-field>
        </div>

        <div class="foot">
            <mt-button @click.native="save" type="primary" size="large"
                       :disabled="!(item.lowPressure && item.highPressure && !disableSave)">
                保存血压数据
            </mt-button>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    .mint-field .mint-cell-title {
        width: 2.4rem;
    }

    #app {
        padding: 0.1rem 0;
        .section {
            .mint-cell {
                min-height: 0.96rem;
                .mint-cell-wrapper {
                    padding: 0 0.4rem;
                    font-size: 0.32rem;
                }
                .mine-cell-value {
                    .arrow-right {
                        height: 0.32rem;
                        margin-left: 0.1rem;
                    }
                }
            }
        }
    }

    .mint-field.is-textarea .mint-cell-title {
        padding: 0.2rem 0;
    }

    .mint-cell.is-textarea .mint-cell-value {
        padding: 0 0 0.2rem;
    }

    .mint-cell .mint-cell-value textarea.mint-field-core {
        border-radius: 0.08rem;
        padding: 0.2rem;
    }

    .mint-button {
        font-size: 0.32rem;
        border-radius: 0.08rem;
    }
</style>

<script lang="babel">
    import { Indicator } from 'mint-ui';
    import format from '../../common/format';
    import userAuth from '../../common/userAuth';
    import util from '../../common/util';

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd HH:mm');
    }

    export default{
        data() {
            return {
                id: null, //创建的血压记录ID
                date: null,
                disableSave: false,
                endDate: new Date(),
                item: {
                    measurementTime: new Date(),
                    lowPressure: null,
                    highPressure: null,
                    heartRate: null,
                    medicineCondition: null,
                    remark: null
                }
            };
        },

        created() {
            this.date = formatDate(this.item.measurementTime);
        },

        methods: {
            openPicker() {
                this.$refs.picker.open();
            },

            confirmDate(val) {
                if (val) {
                    this.date = formatDate(val);
                }
            },

            check() {
                let item = this.item;
                if (!(/^\d{2,3}$/.test(item.lowPressure) && item.lowPressure >= 50 && item.lowPressure <= 240)) {
                    util.showMessage({
                        message: '请输入正确的低压值',
                        type: 'custom',
                        duration: 1000
                    });
                    return false;
                }
                if (!(/^\d{2,3}$/.test(item.highPressure) && item.highPressure >= 50 && item.highPressure <= 240)) {
                    util.showMessage({
                        message: '请输入正确的高压值',
                        type: 'custom',
                        duration: 1000
                    });
                    return false;
                }

                if (+item.lowPressure > +item.highPressure) {
                    util.showMessage({
                        message: '舒张压不能大于收缩压',
                        type: 'custom',
                        duration: 1000
                    });
                    return false;
                }

                if (item.heartRate || item.heartRate === 0) {
                    if (!(/^\d{2,3}$/.test(item.heartRate) && item.heartRate >= 30 && item.heartRate <= 200)) {
                        util.showMessage({
                            message: '请输入正确的心率值',
                            type: 'custom',
                            duration: 1000
                        });
                        return false;
                    }
                }
                return true;
            },

            save() {
                if (this.check()) {
                    let id = this.id;
                    let item = this.item;
                    let patientId = userAuth.getUserInfo('patientId');
                    let method;

                    let params = {
                        measurementTime: item.measurementTime.valueOf(),
                        lowPressure: item.lowPressure,
                        highPressure: item.highPressure,
                        heartRate: item.heartRate,
                        medicineCondition: item.medicineCondition,
                        remark: item.remark
                    };

                    if (id) {
                        params.id = id;
                        method = 'blood-pressure-update';
                    } else {
                        params.patientId = patientId;
                        method = 'blood-pressure-add';
                    }

                    this.disableSave = true;
                    Indicator.open();

                    this.$http.post('/baseApi/health-data/' + method, params).then(
                        (response) => {
                            let res = response.data;
                            Indicator.close();

                            if (res.result === 0 ) {
                                this.id = res.data;
                                util.showMessage({
                                    type: 'saveSuc',
                                    duration: 1000
                                });
                                util.changeLocation({
                                    changeTo: 'bloodPressure.html',
                                    timeOut: 1000
                                });
                            } else {
                                this.disableSave = false;
                                util.showMessage({
                                    type: 'saveFai'
                                });
                            }
                        },
                        (response) => { //eslint-disable-line no-unused-vars
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
        }
    };
</script>
