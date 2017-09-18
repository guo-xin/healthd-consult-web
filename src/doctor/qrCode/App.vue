<template>
    <div id="app">
        <div v-show="!isFirst">
            <div class="basis">
                <div class="left">
                <span class="circle border">
                    <img :src="head">
                </span>
                </div>
                <div class="right">
                    <p class="name" v-text="item.name"></p>

                    <p class="title">
                        <span v-text="item.department"></span><span> | </span><span v-text="item.jobTitle"></span>
                    </p>

                    <p class="hospital" v-text="item.hospitalName"></p>
                </div>
            </div>

            <div class="wrapper">
                <div>
                    <div>
                        <img :src="item.qrcodeUrl">
                    </div>
                </div>

                <p>
                    让患者微信扫一扫加我
                </p>
            </div>
        </div>

        <div class="blank" v-show="isShowBlank">
            <div>
                <img src="../../assets/img/blank-treat.png">
                <h3>
                    您的信息正在更新中<br/>请稍后
                </h3>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        padding: 0.76rem 0.64rem;
        background: #f7f7f9 url("./bg2.png") top center no-repeat;
        background-size: cover;

        & > div {
            background: #e7ebef;
            border: 1px solid #d4d4d4;
            box-shadow: 0.04rem 0.08rem 0.16rem 0px rgba(0, 0, 0, 0.10);
            border-radius: 0.08rem;
            overflow: hidden;
        }
    }

    .basis {
        padding: 0.4rem 0.6rem 0.4rem 0;
        background: #fff;

        .circle {
            width: 1.28rem;
            height: 1.28rem;
        }

        .left {
            float: left;
            width: 2.1rem;
            text-align: center;
        }

        .right {
            margin-left: 2.1rem;
            min-height: 1.36rem;
        }

        .name {
            font-size: @fontSizeBase;
            color: @textColorBlack;
            margin-bottom: 0.1rem;
        }

        .title {
            font-size: @fontSizeXs;
            color: @textColorLight;
            margin-bottom: 0.1rem;
        }

        .hospital {
            font-size: 0.24rem;
            color: @textColorBase;
        }
    }

    .wrapper {
        padding: 1.44rem 0 1.6rem;
        background: url("./bg1.png") bottom center no-repeat;
        background-size: 100% auto;

        & > div {
            width: 4rem;
            height: 4rem;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.5);
            box-shadow: 0px 0.04rem 0.08rem 0px rgba(0, 0, 0, 0.20);
            border-radius: 0.08rem;
            padding-top: 0.4rem;

            & > div {
                width: 3.2rem;
                height: 3.2rem;
                margin: 0 auto;
                background: #fff;
                padding-top: 0.16rem;
                text-align: center;
            }

            img {
                width: 2.88rem;
            }
        }

        p {
            font-size: @fontSizeXs;
            color: #666;
            text-align: center;
            margin-top: 0.32rem;
        }
    }
</style>

<script lang="babel">
import { Indicator } from 'mint-ui';
import util from '../../common/util';
import doctorAuth from '../../common/doctorAuth';
import global from '../../common/global';

let head = require('../../assets/img/head-doctor.png'); //eslint-disable-line no-undef

export default {
    name: 'app',
    data() {
        return {
            isFirst: true,
            isShowBlank: false,

            head: null,
            item: {}
        };
    },

    mounted() {
        let config = global.getConfig();
        if (config.accessFromApp) {
            Indicator.open();
            this.$http.get('/baseApi/doctor/info', {
                params: {
                    doctorId: config.doctorId
                }
            }).then(
                (response) => {
                    this.isFirst = false;
                    let res = response.data;
                    Indicator.close();

                    if (res.result == 0) {
                        this.item = res.data;

                        if (this.item.headPic) {
                            this.head = this.item.headPic;
                        } else {
                            this.head = head;
                        }
                    } else {
                        util.showMessage({
                            type: 'loadFai',
                            duration: 1000
                        });
                    }
                },
                () => {
                    this.isFirst = false;

                    Indicator.close();
                    util.showMessage({
                        type: 'loadFai',
                        duration: 1000
                    });
                }
            );
        } else {
            this.item = doctorAuth.getDoctorInfo();
            if (this.item.exist == false) {
                this.isShowBlank = true;
            } else {
                this.isFirst = false;
            }

            if (this.item.headPic) {
                this.head = this.item.headPic;
            } else {
                this.head = head;
            }
        }
    }
};
</script>
