<template>
    <div id="app">
        <div class="section">
            <mt-cell class="unit" title="血糖值">
                <span class="field-text" v-text="item.bloodGlucoseLever || '未填写'"></span><span v-show="item.heartRate">mmol/L</span>
            </mt-cell>
            <mt-cell title="测量时间">
                <span class="field-text" v-text="date || '未填写'"></span>
            </mt-cell>

            <mt-cell title="测量点">
                <span class="field-text" v-text="selectedPointText || '未填写'"></span>
            </mt-cell>

            <mt-cell class="unit" title="体重">
                <span class="field-text" v-text="item.weight || '未填写'"></span><span v-show="item.heartRate">kg</span>
            </mt-cell>
        </div>

        <div class="section">
            <mt-cell title="服药情况"></mt-cell>
            <mt-cell class="area" title="">
                <span class="field-text" v-text="item.medicineCondition || '未填写'"></span>
            </mt-cell>
        </div>

        <div class="section">
            <mt-cell title="饮食情况"></mt-cell>
            <mt-cell class="area" title="">
                <span class="field-text" v-text="item.dietCondition || '未填写'"></span>
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

    .mint-field .mint-cell-title{
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
        },

        created() {
            util.setTitleByPatient(util.getParams('patientId'), {
                success: '{{patient}}的血糖记录详情',
                fail: '患者血糖记录详情'
            });
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
                        this.selectedPointText = this.slots[this.item.timePoint].text;
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
