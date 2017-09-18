<template>
    <div id="app" class="foot-fixed">
        <div>
            <div class="section">
                <mt-checklist align="right" class="page-part" title="勾选您的个人病史，并点击下方保存按钮。真实的个人病史有助
于医生对您病情的判断" v-model="item.value" :options="item.options">
                </mt-checklist>
            </div>

            <div class="section">
                <mt-field label="其他疾病" placeholder="" type="textarea" rows="4"
                          :attr="{maxlength:200}" v-model.trim="item.others"></mt-field>
            </div>

            <div class="foot">
                <mt-button @click.native="save" type="primary" size="large">保存</mt-button>
            </div>
        </div>
    </div>

</template>

<script lang="babel">
import {Indicator} from 'mint-ui';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

let patientId = userAuth.getUserInfo('patientId');

export default {
    name: 'app',
    data() {
        return {
            disableBtn: true,
            item: {
                options: [],
                value: [],
                others: null
            }
        };
    },
    methods: {
        //保存
        save: function () {
            let params = {
                patientId: patientId,
                diseaseIds: this.item.value,
                others: this.item.others
            };
            //health-record/diseases/self
            this.$http.post('/baseApi/health-record/diseases/self', params).then(
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
                            timeOut: 1000
                        });
                    } else {
                        util.showMessage({
                            type: 'saveFai',
                            duration: 1000
                        });
                    }
                },
                (response) => { //eslint-disable-line no-unused-vars
                    this.disableSave = false;
                    Indicator.close();
                    util.showMessage({
                        type: 'saveFai',
                        duration: 1000
                    });
                }
            );
        },

        //格式化页面显示数据
        formatData: function () {
            this.item = Object.assign(this.item, {
                options: [],
                value: []
            });
            let diseases = this.item.diseases;
            for (var i = 0; i < diseases.length; i++) {
                this.item.options.push({
                    label: diseases[i].name,
                    value: diseases[i].id
                });
                if (diseases[i].checked == 1) {
                    this.item.value.push(diseases[i].id);
                }
            }
        },

        //获取数据请求
        getData() {
            Indicator.open();

            //http://localhost:8080/chronicd-server-api/v1/health-record/diseases/self?patientId=807
            this.$http.get('/baseApi/health-record/diseases/self', {
                params: {
                    patientId: patientId
                }
            }).then(
                (response) => {
                    Indicator.close();

                    let res = response.data;
                    if (res.result === 0) {
                        this.disableBtn = false;
                        this.item = res.data;
                        this.formatData();
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

        .mint-checklist {
            .mint-checklist-title {
                color: @textColorLight;
                padding: 8px 20px;
                margin: 0;
            }
            .mint-cell:nth-child(2) .mint-cell-wrapper {
                background: @white;
            }

            .mint-checklist-label {
                padding: 0;

                .mint-checkbox-label {
                    margin: 0;
                    color: @textColorBlack;
                }
            }

        }

    }
    .mint-field.is-textarea .mint-cell-title {
        padding: 0.2rem 0;
    }
    #app .mint-checklist .mint-checklist-title {
        padding: 0.16rem 0.4rem;
    }
    .mint-cell {
        min-height: 0.96rem;
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
