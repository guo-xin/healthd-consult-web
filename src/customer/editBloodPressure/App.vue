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
            <mt-field class="unit" label="低压（舒张压）" placeholder="请填写" v-model.trim="item.lowPressure"><span>mmHg</span>
            </mt-field>
            <mt-field class="unit" label="高压（收缩压）" placeholder="请填写" v-model.trim="item.highPressure"><span>mmHg</span>
            </mt-field>
            <mt-field class="unit" label="心率（选填）" placeholder="请填写" v-model.trim="item.heartRate"><span>bpm</span></mt-field>
        </div>

        <div class="section" @click="scroll('text1')" id='text1'>
            <mt-field label="服药情况（选填）" placeholder="如：安泰地坪 5毫克 口服 一日1次"  type="textarea" rows="4"
                      v-model.trim="item.medicineCondition" :attr="{ maxlength: 200 }"></mt-field>
        </div>

        <div class="section" @click="scroll('text2')" id="text2">
            <mt-field label="备注（选填）" placeholder="如：月经、劳累、情绪变化、血糖低等情况"  type="textarea" rows="4" v-model.trim="item.remark"
                      :attr="{ maxlength: 200 }"></mt-field>
        </div>

        <div class="foot" :class="{ 'save-only':isSaveOnly }">
            <div v-if="!isSaveOnly">
                <mt-button @click.native="remove" type="primary" size="large" :disabled="disableBtn" plain>
                    删除数据
                </mt-button>
            </div>

            <div>
                <mt-button @click.native="save" type="primary" size="large"
                           :disabled="!(item.lowPressure && item.highPressure && !disableBtn)">
                    保存血压数据
                </mt-button>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    .mint-field .mint-cell-title {
        width: 2.4rem;
    }

    #app > div {
        margin-top: @gap;

        &:first-child {
            margin-top: 0;
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

    .foot.save-only {
        & > div {
            width: 100%;
            padding: 0;
        }
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
    import { Indicator } from 'mint-ui';
    import format from '../../common/format';
    import util from '../../common/util';
    import http from '../../common/http'; //eslint-disable-line no-unused-vars

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd HH:mm');
    }

    export default{
        data() {
            return {
                date: null,
                endDate: new Date(),
                isSaveOnly: true,
                disableBtn: true,
                item: {
                    measurementTime: null,
                    lowPressure: null,
                    highPressure: null,
                    heartRate: null,
                    medicineCondition: null,
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

            scroll(eleName) {
                document.getElementsByTagName('body')[0].scrollTop = document.getElementById(eleName).offsetTop;
            },

            remove() {
                Indicator.open();
                this.disableBtn = true;
                this.$http.get('/baseApi/health-data/blood-pressure-delete', {
                    params: {
                        id: this.id
                    }
                }).then(
                    (response) => {
                        this.disableBtn = false;
                        Indicator.close();

                        let res = response.data;
                        if (res.result !== 0) {
                            util.showMessage({
                                type: 'custom',
                                message: '数据删除失败',
                                duration: 1000
                            });
                        }
                    },
                    (response) => { //eslint-disable-line no-unused-vars
                        this.disableBtn = false;
                        util.showMessage({
                            type: 'custom',
                            message: '数据删除失败',
                            duration: 1000
                        });
                        Indicator.close();
                    }
                );
            },

            check() {
                let item = this.item;
                if (!(/^\d{2,3}$/.test(item.lowPressure) && item.lowPressure >= 50 && item.lowPressure <= 240)) {
                    util.showMessage({
                        type: 'custom',
                        message: '请输入正确的低压值',
                        duration: 1000
                    });
                    return false;
                }

                if (!(/^\d{2,3}$/.test(item.highPressure) && item.highPressure >= 50 && item.highPressure <= 240)) {
                    util.showMessage({
                        type: 'custom',
                        message: '请输入正确的高压值',
                        duration: 1000
                    });
                    return false;
                }

                if (parseInt(item.lowPressure) > parseInt(item.highPressure)) {
                    util.showMessage({
                        type: 'custom',
                        message: '舒张压不能大于收缩压',
                        duration: 1000
                    });
                    return false;
                }

                if (item.heartRate || item.heartRate == 0) {
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
                    let item = this.item;

                    this.disableBtn = true;
                    Indicator.open();
                    this.$http.post('/baseApi/health-data/blood-pressure-update', {
                        measurementTime: item.measurementTime.valueOf(),
                        lowPressure: item.lowPressure,
                        highPressure: item.highPressure,
                        heartRate: item.heartRate,
                        medicineCondition: item.medicineCondition,
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
                                    changeTo: 'bloodPressure.html',
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
            this.$http.get('/baseApi/health-data/blood-pressure-detail', {
                params: {
                    id: id
                }
            }).then(
                (response) => {
                    Indicator.close();

                    let res = response.data;
                    if (res.result === 0) {
                        this.disableBtn = false;
                        this.item = res.data;
                        this.item.measurementTime = new Date(this.item.measurementTime);
                        this.date = formatDate(this.item.measurementTime);
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
