<template>
    <div id="app" class="foot-fixed">
        <div>
            <div class="section">
                <mt-field label="姓名" placeholder="请填写" :attr="{maxlength:16}" v-model.trim="item.userName"></mt-field>

                <a class="mint-cell mint-field unit">
                    <div class="mint-cell-wrapper">
                        <div class="mint-cell-title">
                            <span class="mint-cell-text" v-text="'性别'"></span>
                        </div>
                        <div class="mint-cell-value" @click="sexVisible = true">
                            <span class="mint-field-default" v-text="'请选择'"
                                  v-if="!(item.sex || item.sex == 0)"></span>
                            <span class="mint-field-core"
                                  v-else>{{item.sex | sex}}</span>
                            <div class="mint-field-other">
                                <img src="../../assets/img/more.png">
                            </div>
                        </div>
                    </div>
                </a>

                <a class="mint-cell mint-field unit">
                    <div class="mint-cell-wrapper">
                        <div class="mint-cell-title">
                            <span class="mint-cell-text" v-text="'生日'"></span>
                        </div>
                        <div class="mint-cell-value" @click="checkShow('dateVisible')">
                            <span class="mint-field-default" v-text="'请选择'"
                                  v-if="!item.birthday"></span>
                            <span class="mint-field-core" v-text="item.birthday"
                                  v-else></span>
                            <div class="mint-field-other">
                                <img src="../../assets/img/more.png">
                            </div>
                        </div>
                    </div>
                </a>


                <mt-field label="年龄" placeholder="0" v-model="age" readonly class="readonly"></mt-field>

                <mt-field label="手机号码" placeholder="请填写" v-model="item.mobilePhone" readonly class="readonly"></mt-field>

                <mt-field class="unit" label="身高" placeholder="请填写" v-model.number="item.ext.height" @change="bmiChange"
                          type="tel">
                    <span v-text="'cm'"></span>
                </mt-field>

                <mt-field class="unit" label="体重" placeholder="请填写" v-model.number="item.ext.weight" @change="bmiChange"
                          type="tel">
                    <span v-text="'kg'"></span>
                </mt-field>

                <mt-field class="unit" label="腰围" placeholder="请填写" v-model.number="item.ext.waistLine" type="tel">
                    <span v-text="'cm'"></span>
                </mt-field>

                <mt-field label="BMI" placeholder="根据身高体重自动计算" v-model.number="item.ext.bmi" readonly class="readonly">
                </mt-field>

                <a class="mint-cell mint-field unit">
                    <div class="mint-cell-wrapper">
                        <div class="mint-cell-title">
                            <span class="mint-cell-text" v-text="'血型'"></span>
                        </div>
                        <div class="mint-cell-value" @click="checkShow('bloodType')">
                            <span class="mint-field-default" v-text="'请选择'"
                                  v-if="!bloodText"></span>
                            <span class="mint-field-core"
                                  v-else v-text="bloodText"></span>
                            <div class="mint-field-other">
                                <img src="../../assets/img/more.png">
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <div class="section">
                <mt-field label="过敏史" placeholder="如：青霉素过敏；花粉过敏" type="textarea" v-model.trim="item.ext.allergies"
                          rows="4" :attr="{maxlength:200}"></mt-field>
            </div>

            <div class="section">
                <a class="mint-cell mint-field unit">
                    <div class="mint-cell-wrapper">
                        <div class="mint-cell-title">
                            <span class="mint-cell-text" v-text="'文化程度'"></span>
                        </div>
                        <div class="mint-cell-value" @click="checkShow('educationLevel')">
                            <span class="mint-field-default" v-text="'请选择'"
                                  v-if="!educationText"></span>
                            <span class="mint-field-core" v-text="educationText"
                                  v-else></span>
                            <div class="mint-field-other">
                                <img src="../../assets/img/more.png">
                            </div>
                        </div>
                    </div>
                </a>

                <a class="mint-cell mint-field unit">
                    <div class="mint-cell-wrapper">
                        <div class="mint-cell-title">
                            <span class="mint-cell-text" v-text="'婚姻状况'"></span>
                        </div>
                        <div class="mint-cell-value" @click="marriageVisible = true">
                            <span class="mint-field-default" v-text="'请选择'"
                                  v-if="!(item.ext.maritalStatus || item.ext.maritalStatus === 0)"></span>
                            <span class="mint-field-core"
                                  v-else>{{item.ext.maritalStatus | maritalStatus}}</span>
                            <div class="mint-field-other">
                                <img src="../../assets/img/more.png">
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <div class="foot">
                <mt-button @click.native="save" type="primary" size="large"
                           :disabled="!(item.userName && item.birthday && (item.sex || item.sex == 0) && !disableSave)">保存
                </mt-button>
            </div>

            <select-picker :selected-value="selectedBloodType" :options="bloodSlots" ref="bloodType"
                           @confirm="bloodConfirm"></select-picker>

            <select-picker :selected-value="selectedEducationType" :options="educationSlots" ref="educationLevel"
                           @confirm="educationConfirm"></select-picker>


            <mt-actionsheet :actions="sexActions" v-model="sexVisible" cancel-text=""></mt-actionsheet>


            <mt-actionsheet :actions="marriageActions" v-model="marriageVisible" cancel-text=""></mt-actionsheet>

            <mt-datetime-picker ref="dateVisible" type="date" :start-date="startDate" :end-date="endDate"
                                year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"
                                v-model="timeValue" @confirm="handleChange"></mt-datetime-picker>
        </div>
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
            disableSave: true,
            sexVisible: false,
            dateVisible: false,
            startDate: new Date('1900/01/01'),
            endDate: new Date(),
            timeValue: new Date('1985/05/30'),
            currentValue: '',
            age: null,
            marriageVisible: false,

            selectedBloodType: 11,
            bloodText: null,
            //10：A型 11：B型 12：O型 13：AB型
            bloodSlots: [
                { value: 10, text: 'A型'},
                { value: 11, text: 'B型'},
                { value: 12, text: 'AB型'},
                { value: 13, text: 'O型'}
            ],
            selectedEducationType: 4,
            educationText: null,
            //3：大专及以下 4：本科5：研究生及以上
            educationSlots: [
                { value: 3, text: '大专及以下'},
                { value: 4, text: '本科'},
                { value: 5, text: '研究生及以上'}
            ],

            item: {
                userName: '',
                sex: null,
                birthday: '',
                mobilePhone: '',
                ext: {
                    patientId: null,
                    height: null,
                    weight: null,
                    waistLine: null,
                    bmi: null,
                    bloodType: null,
                    allergies: '',
                    educationLevel: null,
                    maritalStatus: null
                }

            },

            sexActions: [{
                name: '男',
                method: () => {
                    return this.checkSex(0);
                }
            }, {
                name: '女',
                method: () => {
                    return this.checkSex(1);
                }
            }],

            marriageActions: [
                {
                    name: '未婚',
                    method: () => {
                        return this.checkMarriage(0);
                    }
                },
                {
                    name: '已婚',
                    method: () => {
                        return this.checkMarriage(1);
                    }
                }
            ]
        };
    },

    methods: {
        //选择性别
        checkSex(sex) {
            this.item.sex = sex;
        },

        //选择婚姻状况
        checkMarriage(marriage) {
            this.item.ext.maritalStatus = marriage;
        },

        //选择血型类型
        bloodConfirm: function (obj) {
            this.bloodText = obj.text;
            this.item.ext.bloodType = obj.value;
        },
        //选择学历类型
        educationConfirm: function (obj) {
            this.educationText = obj.text;
            this.item.ext.educationLevel = obj.value;
        },


        //身高,体重值改变
        bmiChange() {
            if (this.item.ext.height && this.item.ext.weight) {
                let height = this.item.ext.height / 100;
                this.item.ext.bmi = (this.item.ext.weight / (height * height)).toFixed(1);
            }
        },

        //底部时间下拉弹框的显示
        checkShow(val) {
            this.$refs[val].visible = true;
        },

        //时间选择控件
        handleChange(value) {
            if (value) {
                this.item.birthday = format.formatDate(value, 'yyyy.MM.dd');
                this.age = format.formatAge(value);
            }
        },

        //输入验证
        check() {
            let obj = this.item.ext;
            let canSave = true;

            //身高验证
            if (obj.height) {
                if (!(/^\d+(\.\d+)?$/).test(obj.height) || obj.height < 1 || obj.height > 250) {
                    util.showMessage({
                        type: 'custom',
                        message: '请输入正确的身高值'
                    });
                    Indicator.close();
                    this.disableSave = false;
                    canSave = false;
                }
            }

            //体重验证
            if (obj.weight) {
                if (!(/^\d+(\.\d+)?$/).test(obj.weight) || obj.weight < 1 || obj.weight > 500) {
                    util.showMessage({
                        type: 'custom',
                        message: '请输入正确的体重值'
                    });
                    Indicator.close();
                    this.disableSave = false;
                    canSave = false;
                }
            }

            //腰围验证
            if (obj.waistLine) {
                if (!(/^\d+$/).test(obj.waistLine) || obj.waistLine < 1 || obj.waistLine > 400) {
                    util.showMessage({
                        type: 'custom',
                        message: '请输入正确的腰围值'
                    });
                    Indicator.close();
                    this.disableSave = false;
                    canSave = false;
                }
            }
            return canSave;
        },
        //保存操作
        save: function () {
            let patientId = userAuth.getUserInfo('patientId');

            this.disableSave = true;

            let ext = this.item.ext;
            if (this.check()) {
                Indicator.open();
                let params = {
                    userName: this.item.userName,
                    sex: this.item.sex,
                    birthday: this.timeValue.valueOf(),
                    mobilePhone: this.item.mobilePhone,
                    systemUserId: userAuth.getUserInfo('systemUserId'),
                    patientExt: {
                        patientId: patientId,
                        height: ext.height,
                        weight: ext.weight,
                        waistLine: ext.waistLine,
                        bmi: ext.bmi,
                        bloodType: ext.bloodType,
                        educationLevel: ext.educationLevel,
                        maritalStatus: ext.maritalStatus,
                        allergies: ext.allergies
                    }
                };

                this.$http.post('/baseApi/user/save', params).then(
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
                                changeTo: 'myHealthArchives.html',
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
        },

        //格式化页面显示数据
        formatData: function () {
            this.age = format.formatAge(this.item.birthday);
            this.timeValue = new Date(this.item.birthday);
            this.item.birthday = format.formatDate(this.item.birthday, 'yyyy.MM.dd');

            //血型
            this.bloodText = (this.bloodSlots.find((item) => {
                return item.value == this.item.ext.bloodType;
            }) || {}).text;

            //学历
            this.educationText = (this.educationSlots.find((item) => {
                return item.value == this.item.ext.educationLevel;
            }) || {}).text;
        },

        //获取数据请求
        getData() {
            Indicator.open();
            let chronicdUserId = userAuth.getUserInfo('id');

            this.$http.get('/baseApi/user/detail', {
                params: {
                    chronicdUserId: chronicdUserId
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

    mounted() {
        this.getData();
    }
};
</script>

<style lang="less">
    @import "../../assets/css/common.less";

    #app {
        padding: 0.2rem 0 0.6rem 0;

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

        .mint-popup {
            width: 100%;
        }

        .mint-cell {
            min-height: 0.96rem;
        }
    }

    .mint-field .mint-cell-title {
        width: 2.1rem;
    }

    .mint-field.is-textarea .mint-cell-title {
        padding: 0.2rem 0;
    }
</style>
