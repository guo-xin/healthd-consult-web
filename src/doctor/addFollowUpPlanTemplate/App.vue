<template>
    <div id="app" class="foot-fixed">
       <div>
           <div class="section">
               <!--<mt-field label="计划名称" placeholder="请填写" type="text" v-model.trim="item.templateName">-->
               <!--</mt-field>-->
               <!--<mt-field label="就诊日期" placeholder="请选择" type="text" readonly @click.native="openPicker"-->
               <!--v-model="item.date"></mt-field>-->

               <a class="mint-cell mint-field plan-name">
                   <div class="mint-cell-wrapper">
                       <div class="mint-cell-title">
                           <span class="mint-cell-text" v-text="'模板名称'"></span>
                       </div>
                       <div class="mint-cell-value">
                           <input placeholder="请填写" v-model.trim="item.templateName" type="text">
                           <div class="mint-field-other">
                               <img src="../../assets/img/more.png">
                           </div>
                       </div>
                   </div>
               </a>
               <a class="mint-cell mint-field plan-name">
                   <div class="mint-cell-wrapper">
                       <div class="mint-cell-title">
                           <span class="mint-cell-text" v-text="'随访开始日期'"></span>
                       </div>
                       <div class="mint-cell-value" @click="checkShow('dateType')">
                        <span class="mint-field-default" v-text="'请选择'"
                              v-if="!dateTypeText"></span>
                           <span class="mint-field-core" v-text="dateTypeText"
                                 v-else></span>
                           <div class="mint-field-other">
                               <img src="../../assets/img/more.png">
                           </div>
                       </div>
                   </div>
               </a>

               <select-picker :selected-value="selectedDateType" :options="dateTypeSlots" ref="dateType"
                              @confirm="dateTypeConfirm"></select-picker>
               <interval-date-picker ref="sendPoint" @confirm="confirmSendPoint"></interval-date-picker>

               <select-picker :selected-value="selectedRemindType" :options="remindTypes" ref="remindType"
                              @confirm="confirmRemindType"></select-picker>
           </div>

           <div class="section">
               <div class="timeLine" :class="{ disableDel: records.length < 2}">
                   <mt-cell v-for="(record, index) in records">
                       <div class="container">
                           <div class="time-point" @click="deletePlan($event, index)"></div>
                           <div class="time-text">
                               <span v-text="dateTypeTexts" class="sendPoint"></span>
                               <span v-text="record.period" class="period" @click="openSendPoint($event, record)"></span>
                               <!--<span v-text="record.sendDateText" class="date"></span>-->
                           </div>

                           <div>
                               <div class="header" @click="openRemindType($event, record)">
                                   <span v-text="record.remindText"></span>
                                   <span class="arrow"></span>
                               </div>

                               <div class="content">
                                   <textarea rows="4" v-model="record.context" maxlength="200" @blur="onBlur($event, record)"></textarea>
                                   <span class="clear" @click="clearText($event, record)">x</span>
                               </div>
                           </div>
                       </div>
                   </mt-cell>

                   <mt-cell>
                       <div class="time-end" @click="addPlan($event)">
                           <div class="plus"></div>
                           <div class="text">添加随访</div>
                       </div>
                   </mt-cell>
               </div>
           </div>

           <!--<div class="section">-->
           <!--<mt-cell title="提醒患者记录血糖数据">-->
           <!--<mt-switch v-model="item.bpChecked"></mt-switch>-->
           <!--</mt-cell>-->
           <!--<mt-cell title="提醒患者记录血压数据">-->
           <!--<mt-switch v-model="item.bsChecked"></mt-switch>-->
           <!--</mt-cell>-->
           <!--</div>-->

           <div class="foot">
               <mt-button @click.native="add(true)" type="primary" size="large" :disabled="!(item.templateName && !disableBtn)">
                   保存
               </mt-button>
           </div>
       </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
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

        .section {
            &:first-child {
                margin-top: 0;
            }
        }

        .timeLine {
            position: relative;

            &:before {
                content: '';
                position: absolute;
                top: 0.6rem;
                left: 0.4rem;
                bottom: 0.6rem;
                width: 1px;
                background: @blue;
                z-index: 1;
            }

            .mint-cell-wrapper {
                padding: 0 0.4rem 0 0.8rem;
            }

            .mint-cell-title {
                flex: 0
            }

            .mint-cell-value {
                display: block;
                width: 100%;
            }

            .container {
                position: relative;
                padding: 0.4rem 0;
            }

            .time-point {
                width: 0.32rem;
                height: 0.32rem;
                position: absolute;
                background: @blue;
                border-radius: 100%;
                left: -0.56rem;
                top: 0.52rem;

                &:after{
                    content: '';
                    display: inline-block;
                    background: #fff;
                    height: 1px;
                    width: 0.16rem;
                    position: absolute;
                    top: 0.15rem;
                    left: 0.08rem;
                    z-index: 2;
                }
            }

            .time-text {
                margin-bottom: 0.32rem;
                font-size: @fontSizeSm;
                color: @textColorBlack;

                .sendPoint {
                    margin-right: 0.2rem;
                }

                .period {
                    position: relative;
                    margin-right: 0.2rem;
                    display: inline-block;
                    border: 1px solid @blue;
                    border-radius: 0.08rem;
                    width: 1.48rem;
                    line-height: 0.54rem;
                    padding-right: 0.24rem;
                    text-align: center;

                    &:after {
                        border: 2px solid #c8c8cd;
                        border-bottom-width: 0;
                        border-left-width: 0;
                        content: " ";
                        top: 50%;
                        right: 0.25rem;
                        position: absolute;
                        width: 0.1rem;
                        height: 0.1rem;
                        margin-top: -0.1rem;
                        transform: rotate(135deg);
                    }
                }

                .date {
                    color: @textColorLight;
                }
            }

            .header {
                position: relative;
                border-radius: 0.08rem 0.08rem 0 0;
                padding: 0 0.2rem;
                height: 0.72rem;
                line-height: 0.72rem;
                background: @blue;
                color: #fff;
                font-size: @fontSizeSm;

                &:before{
                    content: '';
                    display: block;
                    position: absolute;
                    left: 0.24rem;
                    bottom: -0.12rem;
                    width: 0.24rem;
                    height: 0.24rem;
                    z-index: 1;
                    background: url(../../assets/img/icon-arrow-down.png) center no-repeat;
                    background-size: 100% auto;
                }

                .arrow {
                    border: 2px solid #fff;
                    border-bottom-width: 0;
                    border-left-width: 0;
                    content: " ";
                    top: 50%;
                    right: 0.3rem;
                    position: absolute;
                    width: 0.16rem;
                    height: 0.16rem;
                    transform: translateY(-50%) rotate(45deg);
                }
            }

            .content {
                position: relative;
                background: #fafafa;
                padding: 0.2rem 0.6rem 0.2rem 0.2rem;

                .clear{
                    position: absolute;
                    top: 50%;
                    right: 0.24rem;
                    margin-top: -0.1rem;
                    display: inline-block;
                    width: 0.2rem;
                    height: 0.04rem;
                    background: #c8c8cd;
                    line-height: 0;
                    font-size: 0;
                    vertical-align: middle;
                    -webkit-transform: rotate(45deg);
                }
                .clear:after {
                    content: '/';
                    display: block;
                    width: 0.2rem;
                    height: 0.04rem;
                    background: #c8c8cd;
                    -webkit-transform: rotate(-90deg);
                }
            }

            textarea {
                resize: none;
                padding: 0.1rem;
                width: 100%;
                border: 0;
                font-size: @fontSizeSm;
                color: @textColorBase;
                font-family: @font-family;
                background-color: transparent;
            }

            .time-end{
                position: relative;

                .plus{
                    position: absolute;
                    height: 0.32rem;
                    width: 0.32rem;
                    background: @blue;
                    border-radius: 50%;
                    left: -0.55rem;
                    bottom: 0.48rem;
                    z-index: 1;

                    &:before{
                        content: '';
                        display: inline-block;
                        height: 1px;
                        width: 0.16rem;
                        background: #fff;
                        position: absolute;
                        top: 0.15rem;
                        left: 0.08rem;
                        transform: rotateZ(90deg);
                    }

                    &:after{
                        content: '';
                        display: inline-block;
                        background: #fff;
                        height: 1px;
                        width: 0.16rem;
                        position: absolute;
                        top: 0.15rem;
                        left: 0.08rem;
                    }
                }

                .text{
                    font-size: @fontSizeSm;
                    color: @textColorBlack;
                    padding: 0.5rem 0;
                }
            }
        }

        .timeLine.disableDel{
            .time-point:after{
                content: normal;
                display: none;
            }
        }
    }
    .mint-cell {
        min-height: 0.96rem;
    }
    .mint-field .mint-cell-title {
        width: 2.1rem;
    }
    .mint-switch-core {
        width: 1.04rem;
        height: 0.64rem;
        border-radius: 0.32rem;
        &::before {
            width: 1rem;
            height: 0.6rem;
            border-radius: 0.3rem;
        }
        &::after {
            width: 0.6rem;
            height: 0.6rem;
            border-radius: 0.3rem;
        }
    }
    .plan-name {
        input {
            display: block;
            appearance: none;
            border-radius: 0;
            border: 0;
            flex: 1;
            outline: 0;
            line-height: 1.6;
            font-size: inherit;
            width: 100%;
            text-align: right;
            color: #999;
        }
        .mint-field-other {
            position: relative;
        }
        img {
            height: 0.23rem;
            margin-left: 0.3rem;
            vertical-align: middle;
        }
    }
</style>

<script lang="babel">
    import {Indicator} from 'mint-ui';
    import format from '../../common/format';
    import util from '../../common/util';
    import doctorAuth from '../../common/doctorAuth';

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd');
    }

    export default {
        name: 'app',
        data() {
            return {
                doctorId: '',
                patientId: '',

                isCheck: false, //校验敏感词，
                isClickAdd: false, //是否点击了添加按钮

                disableBtn: false,
                templateInfo: null,
                selectedDate: new Date(),
                startDate: new Date('1900/01/01'),

                selectedRecord: null,
                selectedDateType: null,
                dateTypeText: '',
                dateTypeTexts: '',
                dateType: null,

                item: {
                    templateName: null,
                    date: null,
                    bpChecked: false,
                    bsChecked: false
                },

                selectedRemindType: null,
                remindTypes: [
                    {value: 0, text: '复诊提醒'},
                    {value: 1, text: '用药提醒'},
                    {value: 2, text: '换药提醒'},
                    {value: 4, text: '手术提醒'},
                    {value: 5, text: '注意事项'}
                ],

                dateTypeSlots: [
                    { value: 0, text: '首次治疗'},
                    { value: 1, text: '就诊日期'},
                    { value: 2, text: '治疗结束'},
                    { value: 4, text: '出院日期'},
                    { value: 5, text: '手术日期'},
                    { value: 6, text: '末次月经'}
                ],

                records: [],

                hasDuplicateDates: false //是否存在重复的随访日期
            };
        },

        created() {
            this.selectedDate = new Date();
            this.item.date = formatDate(this.selectedDate);
        },

        methods: {
            openPicker() {
                this.$refs.picker.open();
            },

            /*confirmDate(val){
                if (val) {
                    this.item.date = formatDate(val);
                    this.resetSendDate();
                }
            },*/

            openSendPoint(event, record) {
                //记住当前随访计划
                this.selectedRecord = record;

                this.$refs.sendPoint.open({
                    days: record.intervalDays,
                    dateType: record.intervalDateType
                });
            },

            confirmSendPoint(obj) {
                let record = this.selectedRecord;
                if (obj && record) {
                    //验证修改后的日期是否已存在
                    if (this.verifyDate(obj.days)) {
                        let timestamp = this.selectedDate.valueOf();

                        record.intervalDays = obj.days;
                        record.intervalDateType = obj.dateType;
                        record.period = obj.text;
                        record.sendPointDate = timestamp + record.intervalDays * 24 * 60 * 60 * 1000;
                        //record.sendDateText = format.formatSendDate(this.selectedDate, record.intervalDays);
                    } else {
                        util.showMessage({
                            message: '该随访日期已存在',
                            duration: 1000
                        });
                    }
                }
            },

            openRemindType(e, record) {
                //记住当前随访计划
                this.selectedRecord = record;

                this.selectedRemindType = record.remindType;

                this.$refs.remindType.open();
            },

            confirmRemindType(obj) {
                let record = this.selectedRecord;
                if (obj && record && record.remindType != obj.value) {
                    record.remindType = obj.value;
                    record.remindText = obj.text;
                    record.context = format.formatContext(record.remindType);
                    this.selectedRemindType = obj.value;
                }
            },

            checkShow(type) {
                this.$refs[type].visible = true;
            },

            dateTypeConfirm: function (obj) {
                this.dateTypeText = obj.text;
                this.dateTypeTexts = format.formatSendPoint(obj.value);
                this.dateType = obj.value;
            },

            deletePlan(e, index) {
                if (this.records.length > 1) {
                    this.records.splice(index,1);
                }
            },

            addPlan(e, index) { //eslint-disable-line no-unused-vars
                let timestamp = this.selectedDate.valueOf(); //eslint-disable-line no-unused-vars
                let records = this.records;
                let record = records[records.length - 1];
                let list = [1, 7, 30, 365];
                let el = document.querySelector('.time-end');
                record = Object.assign({}, record);
                record.intervalDays = record.intervalDays + list[record.intervalDateType];
                //record.sendPointDate = timestamp + record.intervalDays * 24 * 60 * 60 * 1000;
                record.period = format.formatSendPeriod(record.intervalDateType, record.intervalDays);
                //record.sendDateText = format.formatSendDate(this.selectedDate, record.intervalDays);
                records.push(record);

                this.$nextTick(function () {
                    if (el && el.scrollIntoView) {
                        el.scrollIntoView({block: 'end', behavior: 'smooth'});
                    }
                });
            },

            //验证当前操作的随访日期是否已存在
            verifyDate(days) {
                let records = this.records;
                let selectedRecord = this.selectedRecord; //eslint-disable-line no-unused-vars
                let record;
                let flag = true;

                for (let i = 0; i < records.length; i++) {
                    record = records[i];

                    if (record != this.selectedRecord && record.intervalDays === days) {
                        flag = false;
                        break;
                    }
                }

                return flag;
            },

            onBlur(event, record) {
                if (record.context) {
                    this.isCheck = true;

                    this.$http.post('/baseApi/sensitive-word/check', {
                        context: record.context
                    }).then(
                        (response) => {
                            this.isCheck = false;

                            let res = response.data;

                            if (res.result == 1 && res.code == -3004) {
                                record.valid = false;
                            } else {
                                record.valid = true;
                            }

                            if (this.isClickAdd) {
                                this.isClickAdd = false;
                                this.add();
                            }
                        },

                        () => {
                            record.valid = false;
                            this.isClickAdd = false;
                            this.isCheck = false;

                            if (this.isClickAdd) {
                                this.isClickAdd = false;
                                this.add();
                            }
                        }
                    );
                }
            },

            clearText(event, record) {
                record.context = '';
            },

            /*resetSendDate(date){
                let records = this.records;
                let record;
                let timestamp = this.selectedDate.valueOf();

                for(let i=0; i<records.length; i++){
                    record = records[i];
                    record.sendPointDate = timestamp + record.intervalDays * 24 * 60 * 60 * 1000;
                    record.sendDateText = format.formatSendDate(this.selectedDate, record.intervalDays);
                }
            },*/

            /*initPlan(list){
                let records = this.records;
                let timestamp = this.selectedDate.valueOf();
                let record;

                for(let i=0; i<list.length; i++){
                    record = list[i];

                    record.remindText = format.formatRemind(record.remindType);
                    record.sendPointText = format.formatSendPoint(record.sendPointType);
                    record.period = format.formatSendPeriod(record.intervalDateType, record.intervalDays);
                    record.sendPointDate = timestamp + record.intervalDays * 24 * 60 * 60 * 1000;
                    record.sendDateText = format.formatSendDate(this.selectedDate, record.intervalDays);

                    records.push(record);
                }
            },*/
            getParams() {
                let list = this.records;
                let item = this.item;
                let endDate = 0; //eslint-disable-line no-unused-vars
                let data = {
                    templateName: item.templateName,
                    sendPointType: this.dateType,
                    records: []
                };
                let record;
                let allValid = true;
                let dateMap = {};

                //data.templateName = item.templateName;
                //data.patientId = this.patientId;
                data.chronicdDoctorId = this.doctorId;
                //data.bloodPressureMeasurement = item.bpChecked ? 0: 1;
                //data.bloodGlucoseMeasurement = item.bsChecked ? 0: 1;
                //data.sendPointType = this.templateInfo.sendPointType;

                this.hasDuplicateDates = false;

                for (let i = 0; i < list.length; i++) {
                    record = list[i];

                    if (dateMap[record.intervalDays]) {
                        this.hasDuplicateDates = true;
                    } else {
                        dateMap[record.intervalDays] = true;
                    }

                    if (record.valid === false) {
                        allValid = false;
                        break;
                    }
                    /*if(!data.startDate ){
                        data.startDate = record.sendPointDate;
                    }else{
                        if(data.startDate > record.sendPointDate){
                            data.startDate = record.sendPointDate;
                        }
                    }

                    if(record.sendPointDate > endDate){
                        endDate = record.sendPointDate;
                    }*/

                    /*data.records.push({
                        context: record.context,
                        intervalDays: record.intervalDays,
                        intervalDateType: record.intervalDateType,
                        sendPointDate: record.sendPointDate,
                        remindType: record.remindType
                    });*/
                    data.records.push({
                        context: record.context,
                        intervalDays: record.intervalDays,
                        intervalDateType: record.intervalDateType,
                        remindType: record.remindType,
                        sendPointType: data.sendPointType
                    });
                }

                //endDate += 24*60*60*1000;
                //data.endingDate = endDate;

                if (allValid) {
                    return data;
                } else {
                    return false;
                }
            },

            add(byHand) {
                if (this.isCheck) {
                    if (byHand) {
                        this.isClickAdd = true;
                    }
                    return;
                }

                let params = this.getParams();

                if (!params) {
                    util.showMessage({
                        message: '您输入的内容中含有敏感词汇',
                        duration: 1500
                    });

                    return;
                }

                if (this.hasDuplicateDates) {
                    util.showMessage({
                        message: '随访日期重复',
                        duration: 1000
                    });

                    return;
                }

                Indicator.open();
                this.disableBtn = true;

                this.$http.post('/baseApi/doctor-follow-up/chronicd-doctor-template-add', params).then(
                    (response) => {
                        Indicator.close();
                        let res = response.data;
                        if (res.result === 0) {
                            util.showMessage({
                                type: 'addSuc',
                                duration: 1000
                            });
                            util.changeLocation({
                                changeTo: 'followUpTemplates.html',
                                timeOut: 600,
                                query: {
                                    patientId: this.patientId,
                                    patientName: util.getParams('patientName'),
                                    device: util.getParams('device'),
                                    chronicdDoctorId: this.doctorId
                                },
                                currWin: true
                            });
                        } else {
                            this.disableBtn = false;
                            util.showMessage({
                                type: 'addFai',
                                duration: 1000
                            });
                        }
                    },
                    (response) => { //eslint-disable-line no-unused-vars
                        this.disableBtn = false;
                        Indicator.close();
                        util.showMessage({
                            type: 'addFai',
                            duration: 1000
                        });
                    }
                );
            }
        },

        mounted() {
            //let templateId = util.getParams('templateId');
            this.patientId = util.getParams('patientId');
            this.doctorId = doctorAuth.getDoctorId();

            /*Indicator.open();
            this.$http.get('/baseApi/doctor-follow-up/template-library-detail', {
                params: {
                    id: templateId
                }
            }).then(
                (response)=>{
                    let res = response.data;

                    if(res.result === 0){
                        this.disableBtn = false;
                        this.templateInfo = res.data.template;
                        this.initPlan(res.data.records);
                    }

                    Indicator.close();
                },
                (response)=>{
                    Indicator.close();
                }
            );*/
            let record = {};

            record.intervalDays = 1;
            record.intervalDateType = 0;
            record.period = format.formatSendPeriod(record.intervalDateType, record.intervalDays);
            record.remindType = 0; //eslint-disable-line no-unused-expressions
            record.remindText = format.formatRemind(record.remindType);
            record.context = format.formatContext(record.remindType);
            //record.sendDateText = format.formatSendDate(this.selectedDate, record.intervalDays);
            this.records.push(record);
            this.dateType = 0;
            this.selectedDateType = 0;
            this.dateTypeText = format.formatDateType(this.dateType);
            this.dateTypeTexts = format.formatSendPoint(this.dateType);
        }
    };
</script>
