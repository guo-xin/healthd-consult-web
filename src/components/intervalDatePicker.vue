<template>
    <mt-popup
            v-model="visible"
            position="bottom">
        <mt-picker :slots="slots" @change="onChange" :visible-item-count="visibleItemCount" :showToolbar="true"
                   ref="picker">
            <span class="mint-action mint-cancel" @click="visible = false">{{cancelText}}</span>
            <span class="mint-action mint-confirm" @click="confirm">{{confirmText}}</span>
        </mt-picker>

    </mt-popup>
</template>
<style>
    .mint-popup {
        width: 100%;
    }

</style>
<script lang="babel">
    import {Popup, Picker} from 'mint-ui';

    let dateTypes = ['天', '周', '月', '年'];
    let daysOfType = [1, 7, 30, 365];

    export default {
        name: 'interval-date-picker',

        props: {
            visibleItemCount: {
                type: Number,
                default: 3
            },

            cancelText: {
                type: String,
                default: '取消'
            },

            confirmText: {
                type: String,
                default: '确定'
            },

            value: null
        },

        data() {
            return {
                currentValue: {
                    days: 1,
                    dateType: 0,
                    num: 1,
                    text: '1天'
                },
                textList: [],
                visible: false,
                slots: []
            };
        },
        components: {
            [Popup.name]: Popup,
            [Picker.name]: Picker
        },

        methods: {
            open(data) {
                if (data) {
                    let dateType = data.dateType;
                    let days = data.days;

                    if ((dateType || dateType == 0) && days) {
                        let num = days / daysOfType[dateType];

                        this.currentValue = {
                            days: days,
                            dateType: dateType,
                            num: num,
                            text: num + dateTypes[dateType]
                        };
                        this.handleExceededValue();
                    }
                }
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            getValue(values) {
                let index = dateTypes.indexOf(values[1]);

                return {
                    days: daysOfType[index] * values[0],
                    dateType: index,
                    num: values[0],
                    text: values.join('')
                };
            },

            onChange(picker, data) { //eslint-disable-line no-unused-vars
                let values = picker.$children.filter(child => child.currentValue !== undefined).map(child => child.currentValue); //eslint-disable-line no-undefined
                this.currentValue = this.getValue(values);
            },

            confirm() {
                this.visible = false;
                this.$emit('confirm', this.currentValue);
            },

            getNumber(days, dateType) {
                return days / daysOfType[dateType];
            },

            handleExceededValue() {
                let currentValue = this.currentValue;

                if (currentValue) {
                    let dateType = currentValue.dateType;
                    let days = currentValue.days;

                    this.$nextTick(() => {
                        this.$refs.picker.setValues([this.getNumber(days, dateType), dateTypes[dateType]]);
                    });
                }
            },

            generateSlots() {
                let numbers = [];

                for (let i = 0; i < 50; i++) {
                    numbers.push(i + 1);
                }
                this.slots = [
                    {
                        flex: 1,
                        values: numbers
                    },
                    {
                        flex: 1,
                        values: ['天', '周', '月', '年']
                    }
                ];
                this.handleExceededValue();
            }
        },

        mounted() {
            this.generateSlots();
        }
    };
</script>
