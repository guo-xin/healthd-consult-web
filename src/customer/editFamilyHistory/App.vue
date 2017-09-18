<template>
    <div id="app" class="foot-fixed">
        <div>
            <p class="notice">如果您的家族中有人患有以下病史，请勾选</p>

            <div class="section" v-for="item in familyDiseases">
                <a class="mint-cell" @click="openRelation($event, item)">
                    <div class="mint-cell-wrapper">
                        <div class="mint-cell-title">
                            <span class="mint-cell-text" v-text="item.name"></span>
                        </div>
                        <div class="mint-cell-value">
                            <label class="mint-checklist-label">
                                <span class="mint-checkbox is-right">
                                    <input type="checkbox" class="mint-checkbox-input same" v-model="item.checked"
                                           disabled>
                                    <span class="mint-checkbox-core"></span>
                                </span>
                            </label>
                        </div>
                    </div>
                </a>
                <div class="relation-info" v-show="item.relationsText && item.relationsText.length>0">
                    <span>家族关系：</span><span v-text="item.relationsText"></span>
                </div>
            </div>

            <div class="section">
                <mt-field label="其他疾病" placeholder="" type="textarea" rows="4"
                          :attr="{maxlength:200}" v-model="others"></mt-field>
            </div>

            <mt-popup v-model="visible">
                <div class="relationCheckList">
                    <div class="close">
                        <div @click="visible=false">
                            <a href="javascript: void(0)">关闭</a>
                        </div>
                    </div>
                    <h3>
                        选择家族关系
                    </h3>
                    <div class="list">
                        <label class="mint-checklist-label" v-for="item in relationList" :class="{checked: item.checked}">
                            <span class="mint-checkbox-label" v-text="item.text"></span>

                            <span class="mint-checkbox">
                            <input type="checkbox" class="mint-checkbox-input" v-model="item.checked">
                            <span class="mint-checkbox-core"></span>
                        </span>
                        </label>
                    </div>
                    <div>
                        <mt-button @click.native="confirmRelation" type="primary" size="large">确定</mt-button>
                    </div>
                </div>
            </mt-popup>

            <div class="foot">
                <mt-button @click.native="save" type="primary" size="large" :disabled="disableBtn">保存</mt-button>
            </div>
        </div>
    </div>

</template>

<style lang="less">
    @import "../../assets/css/common.less";

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

        .notice {
            font-size: @fontSizeSm;
            color: @textColorLight;
            padding: 0.1rem 0.4rem;
        }

        .mint-popup {
            width: 90%;
            border-radius: 0.08rem;
        }

        .relationCheckList {
            padding: 0.4rem;
            position: relative;

            .close {
                text-align: right;
                margin-bottom: 0.1rem;

                div {
                    display: inline-block;
                    width: 0.4rem;
                }

                a {
                    display: inline-block;
                    width: 0.4rem;
                    height: 0.04rem;
                    background: #c8c8cd;
                    line-height: 0;
                    font-size: 0;
                    vertical-align: middle;
                    -webkit-transform: rotate(45deg);
                }
                a:after {
                    content: '/';
                    display: block;
                    width: 0.4rem;
                    height: 0.04rem;
                    background: #c8c8cd;
                    -webkit-transform: rotate(-90deg);
                }
            }

            h3 {
                font-size: @fontSizeBase;
                color: @textColorBlack;
                text-align: center;
            }

            .list {
                margin: 0.5rem auto 0.8rem;
                max-width: 5.6rem;
            }

            .mint-checkbox-label {
                font-size: @fontSizeSm;
                color: @textColorBase;
            }

            .mint-checklist-label {
                position: relative;
                display: inline-block;
                border: 1px solid #dbdbdb;
                border-radius: 0.08rem;
                padding: 0 0.28rem;
                height: 0.7rem;
                line-height: 0.68rem;
                margin: 0.16rem 0.2rem;

                .mint-checkbox-core {
                    display: none;
                    position: absolute;
                    width: 0.32rem;
                    height: 0.32rem;
                    right: -0.12rem;
                    bottom: -0.12rem;
                }

                .mint-checkbox-label {
                    vertical-align: baseline;
                    margin: 0;
                }

                .mint-checkbox-core::after {
                    top: 0.04rem;
                    left: 0.1rem;
                    width: 0.04rem;
                    height: 0.12rem;
                }

                &.checked {
                    border-color: @blue;

                    span{
                        color: @blue;
                    }

                    .mint-checkbox-core {
                        display: block;
                    }
                }
            }

            .mint-button {
                width: 2.4rem;
                height: 0.82rem;
                margin: 0 auto;
            }
        }

    }

    .relation-info {
        font-size: @fontSizeXs;
        color: @textColorLight;
        padding: 0.26rem 0.4rem;
        background: #fff;
        border-top: 1px solid @borderColor;
    }

    .mint-field.is-textarea .mint-cell-title {
        padding: 0.2rem 0;
    }

    .mint-cell {
        min-height: 0.96rem;
    }

    .mint-checklist-label {
        padding: 0 0.2rem;
    }

    .mint-checkbox-core {
        width: 0.4rem;
        height: 0.4rem;
        &::after {
            top: 0.06rem;
            left: 0.12rem;
            position: absolute;
            width: 0.08rem;
            height: 0.16rem;
        }
    }

</style>

<script lang="babel">
import {Indicator} from 'mint-ui';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

let relationsTextList = ['', '祖父母', '外祖父母', '父母', '子女', '兄弟姐妹', '其他'];

export default {
    name: 'app',
    data() {
        return {
            disableBtn: true,
            familyDiseases: [],
            relationList: [
                {value: '1', text: '祖父母', checked: false},
                {value: '2', text: '外祖父母', checked: false},
                {value: '3', text: '父母', checked: false},
                {value: '4', text: '子女', checked: false},
                {value: '5', text: '兄弟姐妹', checked: false},
                {value: '6', text: '其他', checked: false}
            ],
            others: null,
            visible: false
        };
    },

    methods: {
        openRelation(event, item) {
            let list = this.relationList;
            let relations = item.relations;

            for (let i = 0; i < list.length; i++) {
                list[i].checked = relations.indexOf(list[i].value) != -1;
            }

            this.selectedItem = item;
            this.visible = true;
        },

        confirmRelation() {
            let list = this.relationList;
            let relations = [];
            let relationsText = [];

            for (let i = 0; i < list.length; i++) {
                if (list[i].checked) {
                    relations.push(list[i].value);
                    relationsText.push(relationsTextList[list[i].value]);
                }
            }
            this.selectedItem.relations = relations;
            this.selectedItem.relationsText = relationsText.join('、');
            this.selectedItem.checked = relations.length > 0;
            this.visible = false;
        },

        getParams() {
            let data = {
                others: this.others,
                patientId: userAuth.getUserInfo('patientId'),
                familyDiseases: []
            };
            let list = this.familyDiseases;
            let item;

            for (let i = 0; i < list.length; i++) {
                item = list[i];
                if (item.checked) {
                    data.familyDiseases.push({
                        id: item.id,
                        relations: item.relations
                    });
                }
            }

            return data;
        },

        //保存
        save: function () {
            let params = this.getParams();
            Indicator.open();

            this.disableBtn = true;
            this.$http.post('/baseApi/health-record/diseases/family', params).then(
                (response) => {
                    Indicator.close();
                    let res = response.data;

                    if (res.result === 0) {
                        util.showMessage({
                            type: 'saveSuc',
                            duration: 1000
                        });
                        util.changeLocation({
                            changeTo: 'myHealthArchives.html',
                            timeOut: 600
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
        },

        getRelationsText(list = []) {
            let data = [];
            let text;

            for (let i = 0; i < list.length; i++) {
                text = relationsTextList[list[i]];
                text && data.push(text); //eslint-disable-line no-unused-expressions
            }

            return data.join('、');
        },

        initFamilyDiseases(list) {
            let familyDiseases = [];
            let item;
            for (let i = 0; i < list.length; i++) {
                item = list[i];
                item.checked = item.relations.length > 0;
                item.relationsText = this.getRelationsText(item.relations);
                familyDiseases.push(item);
            }
            this.familyDiseases = familyDiseases;
        },

        //获取数据请求
        getData() {
            let patientId = userAuth.getUserInfo('patientId');
            Indicator.open();

            this.$http.get('/baseApi/health-record/diseases/family', {
                params: {
                    patientId: patientId
                }
            }).then(
                (response) => {
                    Indicator.close();
                    let res = response.data;

                    if (res.result === 0) {
                        this.disableBtn = false;
                        this.others = res.data.others;
                        this.initFamilyDiseases(res.data.familyDiseases);
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
