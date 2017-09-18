<template>
    <div id="app" class="foot-fixed">
        <div class="section">
            <mt-cell title="">
                <p class="title">默认标签</p>
                <div class="list">
                    <label class="mint-checklist-label" v-for="item in publicTags" :class="{checked: item.checked}">
                        <span class="mint-checkbox-label" v-text="item.tagName"></span>
                        <span class="mint-checkbox">
                            <input type="checkbox" class="mint-checkbox-input" v-model="item.checked">
                            <span class="mint-checkbox-core"></span>
                        </span>
                    </label>
                </div>
            </mt-cell>

            <mt-cell title="">
                <p class="title">自定义标签</p>
                <mt-button @click.native="open" type="primary" size="large" :disabled="disableBtn">
                    + 新增标签
                </mt-button>
                <div class="list">
                    <label class="mint-checklist-label" v-for="itema in privateTags" :class="{checked: itema.checked}">
                        <span class="mint-checkbox-label" v-text="itema.tagName"></span>
                        <span class="mint-checkbox">
                            <input type="checkbox" class="mint-checkbox-input" v-model="itema.checked">
                            <span class="mint-checkbox-core"></span>
                        </span>
                    </label>
                </div>
            </mt-cell>
        </div>

        <div class="foot">
            <mt-button @click.native="save" type="primary" size="large" :disabled="disableBtn">
                保存
            </mt-button>
        </div>


        <mt-popup v-model="visible">
            <div class="tagPopup">
                <input type="text" placeholder="请输入标签名称" v-model.trim="newTag" maxlength="10">
                <div class="close">
                    <a href="javascript:void(0)" @click="closePopup"></a>
                </div>
                <mt-button @click.native="confirm" type="primary" size="large" :disabled="!newTag">
                    确定
                </mt-button>
            </div>
        </mt-popup>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common.less";

    #app {
        .mint-cell-title {
            flex: 0;
        }

        .mint-cell-value {
            display: block;
            padding: 0.4rem 0 0.1rem;
            width: 100%;

            .title {
                font-size: @fontSizeXs;
                color: @textColorBlack;
                margin-bottom: 0.3rem;
            }

            .mint-button {
                margin-bottom: 0.3rem;
                width: auto;
                padding: 0 0.3rem;
                font-size: @fontSizeSm;
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
            border-radius: 0.08rem;
            padding: 0 0.28rem;
            height: 0.72rem;
            line-height: 0.68rem;
            margin: 0 0.3rem 0.3rem 0;

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
                span {
                    color: @blue;
                }
                .mint-checkbox-core {
                    display: block;
                }
            }
        }

        .mint-popup{
            border-radius: 0.08rem;
            width: 85%;
        }

        .tagPopup{
            padding: 0 0.5rem;
            position: relative;
            input {
                width: 100%;
                padding: 0.3rem 0.32rem;
                margin: 1.2rem auto 0.6rem;
                border: 0;
                border-radius: 0.08rem;
                background: #f7f7f9;
                outline: none;
                font-size: @fontSizeBase;
            }

            .mint-button{
                width:  2.4rem;
                margin: 0 auto 0.4rem;
            }
        }
    }
    .mint-cell {
        min-height: 0.96rem;
    }
    .mint-button {
        border-radius: 0.08rem;
        height: 0.82rem;
    }
    .close {
        position: absolute;
        right: 0.3rem;
        top: 0.3rem;
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
</style>

<script lang="babel">
    import {Indicator} from 'mint-ui';
    import util from '../../common/util';
    import doctorAuth from '../../common/doctorAuth';
    import userAuth from '../../common/userAuth'; //eslint-disable-line no-unused-vars

    export default {
        name: 'app',
        data() {
            return {
                patientId: '',
                doctorId: '',
                visible: false,
                disableBtn: true,

                newTag: null,
                oldTags: [],
                publicTags: [],
                privateTags: [],
                allTagNames: []
            };
        },
        methods: {
            open() {
                this.newTag = null;
                this.visible = true;
            },

            closePopup() {
                this.visible = false;
            },

            confirm() {
                let tag = this.newTag;

                if (tag) {
                    if (this.allTagNames.indexOf(tag) != -1) {
                        this.visible = false;

                        setTimeout(function () {
                            util.showMessage({
                                message: '此标签已存在',
                                duration: 1000
                            });
                        }, 300);

                        return;
                    }

                    Indicator.open();

                    this.$http.post('/baseApi/doctor-patient/tags/save', {
                        chronicdDoctorId: this.doctorId,
                        tagName: tag
                    }).then(
                        (response) => {
                            Indicator.close();

                            let res = response.data;

                            if (res.result == 0) {
                                let item = res.data;
                                item.checked = false;
                                this.privateTags.push(item);
                                this.allTagNames.push(tag);

                                util.showMessage({
                                    type: 'addSuc',
                                    duration: 1000
                                });
                            } else {
                                util.showMessage({
                                    type: 'addFai',
                                    duration: 1000
                                });
                            }
                        },

                        (response) => { //eslint-disable-line no-unused-vars
                            Indicator.close();
                            util.showMessage({
                                type: 'addFai',
                                duration: 1000
                            });
                        }
                    );
                }

                this.visible = false;
            },

            getParams(list) {
                let patientId = this.patientId;
                let doctorId = this.doctorId;
                let data = [];
                let item;
                for (let i = 0; i < list.length; i++) {
                    item = list[i];
                    if (item.checked) {
                        data.push({
                            tagId: item.id,
                            patientId: patientId,
                            chronicdDoctorId: doctorId
                        });
                    }
                }
                return data;
            },

            save() {
                let data = this.getParams(this.publicTags).concat(this.getParams(this.privateTags));

                let params = {
                    chronicdDoctorId: this.doctorId,
                    patientId: this.patientId,
                    tags: data
                };

                Indicator.open();
                this.disableBtn = true;
                this.$http.post('/baseApi/doctor-patient/tags/patient/save', params).then(
                    (response) => {
                        Indicator.close();
                        let res = response.data;
                        if (res.result == 0) {
                            util.showMessage({
                                type: 'saveSuc',
                                duration: 1000
                            });
                            util.changeLocation({
                                changeTo: 'navsOfPatient.html',
                                timeOut: 600,
                                query: {
                                    patientId: this.patientId
                                }
                            });
                            /*setTimeout(function(){
                                window.history.go(-1);
                            }, 600);*/
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

            initTags(list) {
                let data = [];
                let tags = this.oldTags;
                let names = this.allTagNames;

                for (let i = 0; i < list.length; i++) {
                    list[i].checked = tags.indexOf(list[i].id) != -1;
                    data.push(list[i]);
                    names.push(list[i].tagName);
                }
                return data;
            },

            getData() {
                Indicator.open();
                this.$http.get('/baseApi/doctor-patient/tags/list', {
                    params: {
                        chronicdDoctorId: this.doctorId
                    }
                }).then(
                    (response) => {
                        Indicator.close();
                        let res = response.data;

                        if (res.result == 0) {
                            this.disableBtn = false;
                            this.publicTags = this.initTags(res.data.publicTags);
                            this.privateTags = this.initTags(res.data.privateTags);
                        } else {
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

        created() {
            this.patientId = util.getParams('patientId');
            util.setTitleByPatient(this.patientId, {
                success: '{{patient}}的备注',
                fail: '患者备注'
            });
        },

        mounted() {
            this.doctorId = doctorAuth.getDoctorId();
            this.patientId = util.getParams('patientId');

            this.$http.get('/baseApi/doctor-patient/tags/patient/list', {
                params: {
                    patientId: this.patientId,
                    chronicdDoctorId: this.doctorId
                }
            }).then(
                (response) => {
                    let res = response.data || {};
                    let tags = [];
                    let list = (res.data || {}).patientTags || [];

                    if (res.result === 0) {
                        for (let i = 0; i < list.length; i++) {
                            tags.push(list[i].tagId);
                        }
                        this.oldTags = tags;
                    }

                    this.getData();
                },
                (response) => { //eslint-disable-line no-unused-vars
                    this.getData();
                }
            );
        }
    };
</script>
