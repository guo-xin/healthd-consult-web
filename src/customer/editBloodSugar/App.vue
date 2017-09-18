<template>
    <div id="app" class="foot-fixed">
        <div class="section">
            <mt-field class="unit" label="血糖值" placeholder="请填写" v-model.trim="item.bloodGlucoseLever" type="number"><span>mmol/L</span>
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

            <mt-field class="unit" label="体重（选填）" placeholder="请填写" v-model="item.weight" type="tel" :attr="{ maxlength: 3 }"><span>kg</span>
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
            <mt-button @click.native="save" type="primary" size="large" :disabled="!(item.bloodGlucoseLever && !disableBtn)">
                保存血糖数据
            </mt-button>
        </div>


        <select-picker :selected-value="selectedPoint" :options="slots" ref="point" @confirm="confirmPoint"></select-picker>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    .mint-field .mint-cell-title{
        width: 2.4rem;
    }
    #app {
        .mint-cell {
            min-height: 0.96rem;
            .mint-cell-wrapper {
                font-size: 0.32rem;
            }
        }
    }
    .mint-field.is-textarea .mint-cell-title {
        padding: 0.2rem 0;
    }

</style>

<script lang="babel">
    import {Indicator} from 'mint-ui';
    import format from '../../common/format';
    import util from '../../common/util';
    import http from '../../common/http'; //eslint-disable-line no-unused-vars

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd HH:mm');
    }

    export default{
        data() {
            return {
                disableBtn: true,

                selectedPoint: null,
                selectedPointText: null,
                slots: [
                    { value: 0, text: '早餐前'},
                    { value: 1, text: '早餐后'},
                    { value: 2, text: '午餐前'},
                    { value: 3, text: '午餐后'},
                    { value: 4, text: '晚餐前'},
                    { value: 5, text: '晚餐后'},
                    { value: 6, text: '睡前'}
                ],

                date: null,
                endDate: new Date(),

                item: {
                    bloodGlucoseLever: null,
                    measurementTime: null,
                    timePoint: 0,
                    weight: null,
                    medicineCondition: null,
                    dietCondition: null,
                    remark: null
                }
            };
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

            setPoint(point) {
                this.selectedPoint = point;
                this.selectedPointText = this.slots[point].text;
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
                } else {
                    item.bloodGlucoseLever = (+item.bloodGlucoseLever).toFixed(1);
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

            save() {
                if (this.check()) {
                    let item = this.item;

                    this.disableBtn = true;
                    Indicator.open();

                    this.$http.post('/baseApi/health-data/blood-glucose-update', {
                        bloodGlucoseLever: Math.round(item.bloodGlucoseLever * 100),
                        timePoint: item.timePoint,
                        weight: item.weight ? Math.round(item.weight * 1000) : null,
                        measurementTime: item.measurementTime.valueOf(),
                        medicineCondition: item.medicineCondition,
                        dietCondition: item.dietCondition,
                        remark: item.remark,
                        id: this.id
                    }).then(
                        (response) => {
                            let res = response.data;
                            Indicator.close();

                            if (res.result === 0 ) {
                                util.showMessage({
                                    type: 'saveSuc',
                                    duration: 1000
                                });

                                util.changeLocation({
                                    changeTo: 'bloodSugar.html',
                                    timeOut: 1000
                                });
                            } else {
                                this.disableBtn = false;
                                util.showMessage({
                                    type: 'saveFai',
                                    duration: 1000
                                });
                            }
                        },
                        (response) => { //eslint-disable-line no-unused-vars
                            this.disableBtn = false;
                            Indicator.close();
                            util.showMessage({
                                type: 'saveFai',
                                duration: 1000
                            });
                        }
                    );
                }
            }
        },

        mounted() {
            let id = util.getParams('id');
            this.id = id;

            Indicator.open();
            this.$http.get('/baseApi/health-data/blood-glucose-detail', {
                params: {
                    id: id
                }
            }).then(
                (response)=>{
                    Indicator.close();

                    let res = response.data;
                    if (res.result === 0) {
                        this.disableBtn = false;
                        this.item = res.data;
                        this.item.bloodGlucoseLever = this.item.bloodGlucoseLever / 100;
                        this.item.weight = this.item.weight ? this.item.weight / 1000 : null;
                        this.item.measurementTime = new Date(this.item.measurementTime);
                        this.date = formatDate(this.item.measurementTime);
                        this.setPoint(this.item.timePoint);
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
    };
</script>
