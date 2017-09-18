<template>
    <div id="app" class="foot-fixed">
        <div class="section">
            <mt-field class="unit" label="血糖值" placeholder="请填写" v-model.trim="item.bloodGlucoseLever" type="number">
                <span>mmol/L</span>
            </mt-field>

            <mt-datetime-picker
                    ref="picker"
                    v-model="item.measurementTime"
                    :endDate="endDate"
                    @confirm="confirmDate">
            </mt-datetime-picker>

            <mt-cell title="测量时间">
                <span class="field-text" @click="openPicker" v-text="date"></span><img class="arrow-right"
                                                                                       src="../../assets/img/more.png">
            </mt-cell>

            <mt-cell title="测量点">
                <span class="field-text" @click="openPoint" v-text="selectedPointText"></span><img class="arrow-right"
                                                                                                   src="../../assets/img/more.png">
            </mt-cell>

            <mt-field class="unit" label="体重（选填）" placeholder="请填写" v-model.trim="item.weight" type="tel"
                      :attr="{ maxlength: 3 }"><span>kg</span>
            </mt-field>
        </div>

        <div class="section">
            <mt-field label="服药情况（选填）" placeholder="如：安泰地坪 5毫克 口服 一日1次" type="textarea" rows="4"
                      v-model.trim="item.medicineCondition" :attr="{ maxlength: 200 }"></mt-field>
        </div>

        <div class="section">
            <mt-field label="饮食情况（选填）" placeholder="请详细记录早中晚饮食，如：午餐 米饭 3两" type="textarea" rows="4"
                      v-model.trim="item.dietCondition" :attr="{ maxlength: 200 }"></mt-field>
        </div>


        <div class="section">
            <mt-field label="备注（选填）" placeholder="如：月经、劳累、情绪变化、血糖低等情况" type="textarea" rows="4"
                      v-model.trim="item.remark" :attr="{ maxlength: 200 }"></mt-field>
        </div>

        <div class="foot">
            <mt-button @click.native="save" type="primary" size="large"
                       :disabled="!(item.bloodGlucoseLever && !disableSave)">
                保存血糖数据
            </mt-button>
        </div>

        <select-picker :selected-value="selectedPoint" :options="slots" ref="point"
                       @confirm="confirmPoint"></select-picker>
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
        padding: 0.15rem 0.2rem;
    }

    .mint-button {
        font-size: 0.32rem;
        border-radius: 0.08rem;
    }

    .foot {
        button:active {
            background-color: #2BB4D5;
        }
    }
</style>

<script lang="babel">
    import {Indicator} from 'mint-ui';
    import format from '../../common/format';
    import userAuth from '../../common/userAuth';
    import util from '../../common/util';

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd HH:mm');
    }

    export default{
        data() {
            return {
                id: null, //记录保存后血糖记录ID
                disableSave: false,

                selectedPoint: null,
                selectedPointText: null,
                slots: [
                    {value: 0, text: '早餐前'},
                    {value: 1, text: '早餐后'},
                    {value: 2, text: '午餐前'},
                    {value: 3, text: '午餐后'},
                    {value: 4, text: '晚餐前'},
                    {value: 5, text: '晚餐后'},
                    {value: 6, text: '睡前'}
                ],

                date: null,
                endDate: new Date(),

                item: {
                    bloodGlucoseLever: null,
                    measurementTime: new Date(),
                    timePoint: 0,
                    weight: null,
                    medicineCondition: null,
                    dietCondition: null,
                    remark: null
                }
            };
        },

        created() {
            this.date = formatDate(this.item.measurementTime);
            this.initPoint();
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

            openPoint() {
                this.$refs.point.open();
            },

            confirmPoint(obj) {
                if (obj) {
                    this.selectedPointText = obj.text;
                    this.item.timePoint = obj.value;
                }
            },

            check() {
                let item = this.item;
                if (!(/^[0-9]{1,3}([.]{1}[0-9]+){0,1}$/.test(item.bloodGlucoseLever))) {
                    util.showMessage({
                        type: 'custom',
                        message: '请输入正确的血糖值',
                        duration: 1000
                    });
                    return false;
                }

                if (item.bloodGlucoseLever < 1) {
                    util.showMessage({
                        type: 'custom',
                        message: '血糖值不能低于1',
                        duration: 1000
                    });
                    return false;
                }

                if (item.weight) {
                    if (!(/^\d{1,3}$/.test(item.weight)) || item.weight <= 0 || item.weight >= 500) {
                        util.showMessage({
                            type: 'custom',
                            message: '请输入正确的体重值',
                            duration: 1000
                        });
                        return false;
                    }
                }

                return true;
            },

            initPoint() {
                let h = +format.formatDate(this.item.measurementTime, 'H');
                let point = 0;

                if (h >= 20) {
                    point = 6;
                } else if (h >= 18) {
                    point = 5;
                } else if (h >= 14) {
                    point = 4;
                } else if (h >= 12) {
                    point = 3;
                } else if (h >= 10) {
                    point = 2;
                } else if (h >= 7) {
                    point = 1;
                } else {
                    point = 0;
                }

                this.selectedPoint = point;
                this.item.timePoint = point;
                this.selectedPointText = this.slots[point].text;
            },

            save() {
                if (this.check()) {
                    let id = this.id;
                    let item = this.item;
                    let patientId = userAuth.getUserInfo('patientId');
                    let method;

                    let params = {
                        bloodGlucoseLever: Math.round((+item.bloodGlucoseLever).toFixed(1) * 100),
                        timePoint: item.timePoint,
                        weight: item.weight ? Math.round(item.weight * 1000) : null,
                        measurementTime: item.measurementTime.valueOf(),
                        medicineCondition: item.medicineCondition,
                        dietCondition: item.dietCondition,
                        remark: item.remark
                    };

                    if (id) {
                        params.id = id;
                        method = 'blood-glucose-update';
                    } else {
                        params.patientId = patientId;
                        method = 'blood-glucose-add';
                    }

                    this.disableSave = true;
                    Indicator.open();

                    this.$http.post('/baseApi/health-data/' + method, params).then(
                        (response) => {
                            let res = response.data;
                            Indicator.close();

                            if (res.result === 0) {
                                this.id = res.data;
                                util.showMessage({
                                    type: 'saveSuc',
                                    duration: 1000
                                });
                                util.changeLocation({
                                    changeTo: 'bloodSugar.html',
                                    timeOut: 1000
                                });
                            } else {
                                this.disableSave = false;
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
        }
    };
</script>
