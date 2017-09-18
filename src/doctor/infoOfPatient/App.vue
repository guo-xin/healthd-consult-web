<template>
    <div id="app">

        <div class="section">
            <div class="patient-info">
                <span class="left">
                    <span class="circle border">
                        <img :src="patient.head">
                    </span>
                </span>

                <span class="middle">
                    <p class="name">
                        <span v-text="patient.realName"></span>
                        <img src="../../assets/img/icon-male.png" v-show="patient.sex==0">
                        <img src="../../assets/img/icon-female.png" v-show="patient.sex==1">
                    </p>
                    <p class="age" v-text="patient.age"></p>
                </span>

                <span class="right">
                    <span v-text="patient.birthdayText"></span>
                </span>
            </div>
        </div>

        <div class="section">
            <mt-cell title="身高" :class="{empty: !patientExt.height}"
                     :value="patientExt.height?(patientExt.height+'cm'):'未填写'"></mt-cell>
            <mt-cell title="体重" :class="{empty: !patientExt.weight}"
                     :value="patientExt.weight?(patientExt.weight+'kg'):'未填写'"></mt-cell>
            <mt-cell title="腰围" :class="{empty: !patientExt.waistLine}"
                     :value="patientExt.waistLine?(patientExt.waistLine+'cm'):'未填写'"></mt-cell>
            <mt-cell title="BMI" :class="{empty: !patientExt.bmi}"
                     :value="patientExt.bmi?(patientExt.bmi):'未填写'"></mt-cell>
            <mt-cell title="血型" :class="{empty: !patientExt.bloodType}"
                     :value="patientExt.bloodType?(patientExt.bloodTypeText):'未填写'"></mt-cell>
            <mt-cell title="文化程度" :class="{empty: !patientExt.educationLevel}"
                     :value="patientExt.educationLevel?(patientExt.educationText):'未填写'"></mt-cell>
            <mt-cell title="婚姻状况" :class="{empty: !(patientExt.maritalStatus)}"
                     :value="patientExt.maritalStatus?(patientExt.maritalText):'未填写'"></mt-cell>
        </div>

        <div class="section">
            <mt-cell title="过敏史"></mt-cell>

            <mt-cell class="textarea allergies-history" :class="{empty: !patientExt.allergies}"
                     :value="patientExt.allergies || '未填写'"></mt-cell>
        </div>

        <div class="section">
            <mt-cell title="个人病史"></mt-cell>

            <mt-cell class="textarea personal-history" :class="{empty: !personalHistory}"
                     :value="personalHistory || '未填写'"></mt-cell>
        </div>

        <div class="section" style="display:none">
            <mt-cell title="运动频率" value="170cm"></mt-cell>
            <mt-cell title="运动程度" value="60kg"></mt-cell>
            <mt-cell title="睡眠质量" value="60kg"></mt-cell>
            <mt-cell title="睡眠时长" value="60kg"></mt-cell>
            <mt-cell title="吸烟史" value="60kg"></mt-cell>
            <mt-cell title="二手烟" value="60kg"></mt-cell>
            <mt-cell title="饮酒频率" value="60kg"></mt-cell>
            <mt-cell title="饮酒种类" value="60kg"></mt-cell>
            <mt-cell title="早餐习惯" value="60kg"></mt-cell>
            <mt-cell title="每日蔬果摄入" value="60kg"></mt-cell>
        </div>

        <div class="section">
            <mt-cell title="家族病史"></mt-cell>

            <mt-cell class="textarea family-history" :class="{empty: !familyHistory}"
                     :value="familyHistory || '未填写'"></mt-cell>
        </div>
    </div>
</template>

<style lang="less">

    @import "../../assets/css/common";

    #app{
        -webkit-overflow-scrolling: touch;
    }

    .mint-cell.textarea {
        .mint-cell-title {
            flex: none;
        }

        .mint-cell-value {
            padding: 0.24rem 0;
            line-height: 0.48rem;

            span {
                word-break: break-all;
            }
        }
    }

    .mint-cell-value {
        color: @textColorBlack
    }

    .empty {
        .mint-cell-value {
            color: @textColorLight
        }
    }

    .patient-info {
        background: #fff;
        font-size: 0;
        padding: 0.4rem;
        display: flex;
        align-items: center;

        .circle {
            width: 1.28rem;
            height: 1.28rem;
            background: #eee;
        }

        .left {
            display: block;
            width: 1.68rem;
        }

        .middle {
            flex: 1;
            overflow: hidden;
            display: block;

            .name {
                font-size: @fontSizeBase;
                color: @textColorBlack;

                img {
                    height: 0.32rem;
                    vertical-align: -0.04rem;
                    margin-left: 0.2rem;
                }
            }

            .age {
                font-size: @fontSizeSm;
                color: @textColorBase;
            }
        }

        .right {
            width: 2.08rem;
            text-align: right;
            display: block;

            span {
                font-size: @fontSizeSm;
                color: @textColorBase;
            }
        }
    }

    .mint-cell {
        min-height: 0.96rem;
    }

    .personal-history, .family-history, .allergies-history {
        min-height: 2rem;

        .mint-cell-wrapper {
            align-items: flex-start;
        }
    }

</style>

<script lang="babel">
    import {Indicator} from 'mint-ui';
    import util from '../../common/util';
    import format from '../../common/format';
    import doctorAuth from '../../common/doctorAuth'; //eslint-disable-line no-unused-vars

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd');
    }

    export default {
        name: 'app',
        data() {
            return {
                patient: {},
                patientExt: {},
                personalHistory: null,
                familyHistory: null
            };
        },
        methods: {
            getPersonalHistory(list,other) {
                let diseases = [];
                let item;

                for (let i = 0; i < list.length; i++) {
                    item = list[i];
                    if (item.checked == 1) {
                        diseases.push(item.name);
                    }
                }
                if (other) {
                    diseases.push('   其他：' + other);
                }

                return diseases.join('、');
            },

            getRelations(list) {
                let relations = [];
                let item; //eslint-disable-line no-unused-vars
                let data = ['祖父母', '外祖父母', '父母', '子女', '兄弟姐妹', '其他'];

                for (let i = 0; i < list.length; i++) {
                    item = list[i];
                    relations.push(data[+list[i] - 1]);
                }

                return relations.join('、');
            },

            getFamilyHistory(list, other) {
                let diseases = [];
                let item;

                for (let i = 0; i < list.length; i++) {
                    item = list[i];

                    if (item.relations.length > 0) {
                        diseases.push(item.name + '（' + this.getRelations(item.relations) + '）');
                    }
                }
                if (other) {
                    diseases.push('   其他：' + other);
                }

                return diseases.join('、');
            },

            setPatientExt(obj) {
                obj.bloodTypeText = ({
                    10: 'A型',
                    11: 'B型',
                    12: 'AB型',
                    13: 'O型'
                })[obj.bloodType];

                obj.educationText = ({
                    3: '大专及以下',
                    4: '本科',
                    5: '研究生及以上'
                })[obj.educationLevel];

                obj.maritalText = obj.maritalStatus == 0 ? '未婚' : '已婚';

                this.patientExt = obj;
            },

            getData() {
                Indicator.open();

                this.$http.get('/baseApi/doctor-patient/patient-ext', {
                    params: {
                        patientId: util.getParams('patientId')
                    }
                }).then(
                    (response) => {
                        Indicator.close();
                        let res = response.data;
                        if (res.result == 0) {
                            let data = res.data;

                            this.patient = data.patient || {};
                            this.patient.birthdayText = formatDate(this.patient.birthday);
                            this.patient.age = format.formatAge(this.patient.birthday);
                            this.setPatientExt(data.patientExt || {});
                            this.personalHistory = this.getPersonalHistory((data.self || {}).diseases || [],(data.self || {}).others || '');
                            this.familyHistory = this.getFamilyHistory((data.family || {}).familyDiseases || [],(data.family || {}).others || '');
                        } else {
                            Indicator.close();
                            util.showMessage({
                                type: 'loadFai',
                                duration: 1000
                            });
                        }
                    },
                    (response) => { //eslint-disable-line no-unused-vars
                        Indicator.close();
                        util.showMessage({
                            type: 'loadFai',
                            duration: 1000
                        });
                    }
                );
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>
