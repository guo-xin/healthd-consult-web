<template>
    <div id="app">
        <div class="section">
            <mt-cell class="no-border" title="测量时间">
                <span class="field-text" v-text="date || '未填写'"></span>
            </mt-cell>
        </div>

        <div class="section">
            <mt-cell class="unit" title="低压（舒张压）">
                <span class="field-text" v-text="item.lowPressure || '未填写'"></span><span v-show="item.lowPressure">mmHg</span>
            </mt-cell>
            <mt-cell class="unit" title="高压（收缩压）">
                <span class="field-text" v-text="item.highPressure || '未填写'"></span><span v-show="item.highPressure">mmHg</span>
            </mt-cell>
            <mt-cell class="unit" title="心率">
                <span class="field-text" v-text="item.heartRate || '未填写'"></span><span v-show="item.heartRate">bpm</span>
            </mt-cell>
        </div>

        <div class="section">
            <mt-cell title="服药情况"></mt-cell>
            <mt-cell class="area" title="">
                <span class="field-text" v-text="item.medicineCondition || '未填写'"></span>
            </mt-cell>
        </div>

        <div class="section">
            <mt-cell title="备注"></mt-cell>
            <mt-cell class="area" title="">
                <span class="field-text" v-text="item.remark || '未填写'"></span>
            </mt-cell>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    .mint-field .mint-cell-title {
        width: 2.4rem;
    }

    .area {
        .mint-cell-title {
            flex: 0;
        }

        .mint-cell-value{
            display: block;
            padding: 0.2rem  0;
        }

        .field-text{
            word-break: break-all;
        }
    }
    .mint-cell {
        min-height: 0.96rem;
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

    export default {
        data() {
            return {
                date: null,
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
        },

        created() {
            util.setTitleByPatient(util.getParams('patientId'), {
                success: '{{patient}}的血压记录详情',
                fail: '患者血压记录详情'
            });
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
