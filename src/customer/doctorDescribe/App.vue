<template>
    <div id="app">
        <div class="head">
            <p v-text="'描述症状问医生：'"></p>
            <div class="list">
                <label class="mint-checklist-label" v-for="item in describes" :class="{checked: item.checked}">
                    <span class="mint-checkbox-label" v-text="item.description"></span>
                        <span class="mint-checkbox">
                            <input type="checkbox" class="mint-checkbox-input" v-model="item.checked">
                            <span class="mint-checkbox-core"></span>
                        </span>
                </label>
            </div>
        </div>
        <div class="field">
        <textarea placeholder="请详细描述您的症状、病情（最少4字） 如：3天前出现流涕、咽部疼痛，低烧37.7°。在家服用了阿莫西林胶囊等药物，效果不佳。咽部疼痛无明显缓解，饭量减少。" rows="8"
                  maxlength="200" v-model.trim="describe"></textarea>
        </div>
        <div class="part">
            <p class="button">
                <mt-button size="large" type="primary" @click.native="startInquiry"
                           :disabled="!(describe && describe.length>3 && !state)">
                    下一步
                </mt-button>
            </p>
        </div>

    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        width: 100%;
        height: 100%;
        text-align: center;
        background: @white;
        padding: 0;

        .head {
            p {
                padding: 12px @gapL;
                margin: 0;
                text-align: left;
                font-size: @fontSizeSm;
                color: @textColorBlack;
            }
            .list {
                display: flex;
                padding: 0 @gapL;
                flex-wrap: wrap;
                text-align: left;
            }
        }

        .field {
            margin: 0 @gapL 20px;
            background: #fbfbfb;
            border: 1px solid #e0e0e0;

            textarea {
                font-family: @font-family;
                resize: none;
                font-size: @fontSizeSm;
                color: @textColorBlack;
                padding: 10px;
                border-radius: 4px;
                width: 100%;
                line-height: 1.6;
                outline: none;
                border: none;
                box-sizing: border-box;
            }
        }

        .part {
            padding: @gapL;
            width: 100%;
            box-sizing: border-box;
            position: fixed;
            bottom: 0;
            background: @white;

            p {
                margin: 0;
            }

        }

        .mint-checkbox-label {
            font-size: @fontSizeSm;
            color: @textColorBase;
        }

        .mint-checklist-label {
            position: relative;
            display: inline-block;
            border: 1px solid #dbdbdb;
            border-radius: 4px;
            padding: 0 14px;
            height: 36px;
            line-height: 34px;
            margin: 0 15px 15px 0;
            box-sizing: border-box;

            .mint-checkbox-input {
                display: none;
            }
            .mint-checkbox-core {
                display: none;
                position: absolute;
                width: 16px;
                height: 16px;
                right: -6px;
                bottom: -6px;
            }

            .mint-checkbox-label {
                vertical-align: baseline;
                margin: 0;
            }

            .mint-checkbox-core::after {
                top: 2px;
                left: 5px;
                width: 2px;
                height: 6px;
            }

            &.checked {
                border-color: @blue;
                span {
                    color: @blue;
                }
            }
        }

    }

</style>

<script lang="babel">
    import { Indicator } from 'mint-ui';
    import userAuth from '../../common/userAuth';
    import util from '../../common/util';

    export default {
        name: 'app',
        data() {
            return {
                describes: [],
                describe: '',
                state: false
            };
        },

        methods: {
            //下一步按钮
            startInquiry: function () {
                Indicator.open();
                this.state = true;
                this.$http.post('baseApi/sensitive-word/check', {
                    context: this.describe
                }).then((action)=> {
                    if (action.body.result == 0) {
                        this.$http.post('baseApi/orders/free', {
                            chronicdUserId: userAuth.getUserInfo('id'),
                            consultContent: this.describe + this.completeDescribes(),
                            chronicdDoctorId: util.getParams('chronicdDoctorId'),
                            productId: util.getParams('productId'),
                            patientId: util.getParams('patientId')
                        }).then((response)=> {
                            let res = response.body || {};
                            if (res.result == 0) {
                                util.changeLocation({
                                    changeTo: 'im/index.html',
                                    timeOut: 600,
                                    query: {
                                        roleCode: 1,
                                        consultConversationId: res.data.consultConversationId
                                    }
                                });
                            }
                        }, ()=> {
                            util.showMessage({
                                message: '请求失败',
                                duration: 1000
                            });
                            Indicator.close();
                            this.state = false;
                        });
                    } else if (action.body.result == 1 && action.body.code == -3004) {
                        util.showMessage({
                            message: '包含敏感词汇',
                            duration: 1000
                        });
                        Indicator.close();
                        this.state = false;
                    }
                }, ()=> {
                    util.showMessage({
                        message: '请求失败',
                        duration: 1000
                    });
                    Indicator.close();
                    this.state = false;
                });
            },

            //提交时拼接症状描述
            completeDescribes: function () {
                let extra = [], complete;
                for (var i = 0; i < this.describes.length; i++) {
                    if (this.describes[i].checked) {
                        extra.push(this.describes[i].description);
                    }
                }
                if (extra.length > 0) {
                    complete = '（所选症状：';
                    for (var j = 0; j < extra.length; j++) {
                        if (j < extra.length - 1) {
                            complete += extra[j] + '、';
                        } else {
                            complete += extra[j] + '）';
                        }
                    }
                }

                return (complete || '');
            },

            //格式化症状描述标签
            formatDescribes: function (data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].checked = false;
                }
                return data;
            },

            //查询相关症状
            //http://192.168.11.187:8080/chronicd-server-api/v1/departments/symptoms/doc/3
            getData() {
                let doctorId = util.getParams('doctorId');
                this.$http.get('/baseApi/departments/symptoms/doc/' + doctorId).then((response)=> {
                    let data = response.data || {};
                    if (data.result == 0) {
                        this.describes = this.formatDescribes(data.data || []);
                    }
                    Indicator.close();
                });
            }

        },

        mounted() {
            Indicator.open();
            this.getData();
        }
    };
</script>
