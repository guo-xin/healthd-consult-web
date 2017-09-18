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

    export default {
        name: 'select-picker',

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

            options: {
                type: Array,
                default: []
            },

            selectedValue: [String, Number],

            value: null
        },

        data() {
            return {
                currentValue: null,
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
            open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            getValue(values) {
                let value = values[0];
                let options = this.options;
                let textList = this.textList;

                return options[textList.indexOf(value)];
            },

            onChange(picker) {
                let values = picker.$children.filter(child => child.currentValue !== undefined).map(child => child.currentValue); //eslint-disable-line no-undefined
                this.currentValue = this.getValue(values);
            },

            confirm() {
                this.visible = false;
                this.$emit('confirm', this.currentValue);
            },

            initCurrentValue() {
                let options = this.options;
                let selectedValue = this.selectedValue;
                let currentValue = options[0];

                if (selectedValue != null || selectedValue != undefined) { //eslint-disable-line no-eq-null, no-undefined
                    for (let i = 0; i < options.length; i++) {
                        if (options[i].text == selectedValue || options[i].value == selectedValue) {
                            currentValue = options[i];
                            break;
                        }
                    }
                }
                this.currentValue = currentValue;
            },

            handleExceededValue() {
                if (this.currentValue) {
                    this.$nextTick(() => {
                        this.$refs.picker.setSlotValue(0, this.currentValue.text);
                    });
                }
            },

            generateSlots() {
                let options = this.options;
                let textList = [];

                for (let i = 0; i < options.length; i++) {
                    textList.push(options[i].text);
                }

                this.textList = textList;
                this.slots = [
                    {
                        flex: 1,
                        values: textList
                    }
                ];
                this.handleExceededValue();
            }
        },

        watch: {
            selectedValue(curVal, oldVal) {
                if (curVal != oldVal) {
                    this.initCurrentValue();
                    this.handleExceededValue();
                }
            }
        },

        mounted() {
            this.initCurrentValue();
            this.generateSlots();
        }
    };
</script>
