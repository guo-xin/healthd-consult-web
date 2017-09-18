<template>
    <div id="app">
        <div class="nav">
            <a href="javascript: void(0)"  @click="goToMyPatients"><span>我的患者</span></a>
            <a href="javascript: void(0)" class="active" ><span>未报到患者</span></a>
        </div>
        <div v-show="!isFirst">
            <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="10" infinite-scroll-immediate-check="check">
                <li v-for="item in items">
                <span class="left">
                    <span class="circle">
                        <img :src="item.headPic || defaultHead">
                    </span>
                </span>
                    <span class="right">
                    <p class="name" v-text="item.realName"></p>
                    <p class="date" v-text="item.recommendDate"></p>
                </span>
                </li>
            </ul>
            <div class="remind">
                <div class="notice">所有未报道患者都会收到您的提醒信息</div>
                <mt-button @click.native="toRemind" type="primary" size="large" :class="{sended: items.remind}"
                           :disabled="disableBtn">
                    {{remind ? '您本日已发送过提醒信息' : '一键提醒患者完善信息'}}
                </mt-button>
            </div>
        </div>
        <div class="blank" v-show="isShowBlank">
            <div>
                <img src="../../assets/img/blank-patient.png">
                <h3>
                    您当前没有未报道患者
                </h3>
                <p>
                    让患者微信扫一扫“我的二维码”加我
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        padding-top: 0;
        padding-bottom: 2rem;
        .nav {
            background: #ffffff;
            box-shadow: 0px 0.04rem 0.08rem 0px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            position: relative;
            margin-bottom: 0.13rem;
            &:after {
                content: '';
                position: absolute;
                display: block;
                width: 1px;
                height: 0.36rem;
                left: 50%;
                top: 50%;
                margin-top: -0.18rem;
                background: @borderColor;
            }

            a {
                position: relative;
                float: left;
                display: inline-block;
                width: 50%;
                height: 1rem;
                line-height: 1rem;
                text-align: center;
                font-size: @fontSizeBase;
                color: @textColorBase;
                text-decoration: none;
                &.active {
                    border-bottom: 2px solid @blue;
                }
                span {
                    position: relative;
                    height: 100%;
                    display: inline-block;
                    padding: 0 0.1rem;
                }

                &.active {
                    color: @blue;
                    span:after {
                        content: '';
                        position: absolute;
                        display: block;
                        height: 0.04rem;
                        width: 100%;
                        left: 0;
                        bottom: 0;
                    }
                }
            }
        }
        .list {
            li {
                display: flex;
                margin-top: 0.13rem;
                padding: 0.26rem 0 0.34rem 0.32rem;
                background-color: #fff;
                .left {
                    display: block;
                    margin-right: 0.28rem;
                    .circle {
                        width: 1.2rem;
                        height: 1.2rem;
                        border-radius: 50%;
                        display: inline-block;
                        overflow: hidden;
                        border: 2px solid rgba(154, 157, 167, 0.11);
                    }
                }
                .right {
                    display: block;
                    flex: 1;
                    text-align: left;
                    .name {
                        font-size: 0.32rem;
                        color: #333;
                        padding-top: 0.16rem;
                    }
                    .date {
                        font-size: 0.28rem;
                        color: #999;
                        padding-top: 0.16rem;
                    }
                }
            }
        }
        .remind {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: #fff;
            padding: 0.22rem 0.21rem;
            .notice {
                font-size: 0.24rem;
                color: #c0c0c0;
                text-align: center;
            }
            button {
                margin-top: 0.22rem;
                display: block;
                text-align: center;
                width: 100%;
                height: 1rem;
                line-height: 1rem;
                font-size: 0.32rem;
                color: #fff;
                text-decoration: none;
            }
            .sended {
                background-color: #e6e6e9;
            }
        }
        .blank {
            top: 1.3rem;
        }
    }

</style>

<script lang="babel">
    import {Indicator} from 'mint-ui';
    import format from '../../common/format';
    import doctorAuth from '../../common/doctorAuth';
    import util from '../../common/util';

    export default {
        name: 'app',
        data() {
            return {
                defaultHead: require('../../assets/img/head-patient.png'), //eslint-disable-line no-undef
                loading: false,
                loadingText: false,
                allLoaded: false,
                check: false,
                isFirst: true,
                isShowBlank: false,

                curr: 0,
                size: 10,

                items: [],
                remind: 0,
                disableBtn: false
            };
        },
        methods: {
            goToMyPatients() {
                util.changeLocation({
                    changeTo: 'myPatients.html',
                    timeout: 600
                });
            },

            loadMore() {
                if (!this.allLoaded) {
                    this.getData().then(
                        (response) => this.success(response),
                        (response) => this.error(response)
                    );
                }
            },

            getData() {
                this.loadingText = true;
                this.loading = true;
                this.curr = this.curr + 1;
                let id = doctorAuth.getDoctorInfo('doctorId');

                return this.$http.get('/baseApi/doctor/tourist/list', {
                    params: {
                        doctorId: id
                    }
                });
            },

            success(response) {
                this.loadingText = false;
                this.loading = false;

                let res = response.data;
                let data = res.data || {};

                if (data.remind) {
                    this.remind = 1;
                    this.disableBtn = true;
                }

                if (res.result === 0) {
                    let results = data.touristDoctorList || [];

                    this.appendData(results, this.items);
                } else {
                    this.loading = false;
                    this.loadingText = false;
                    util.showMessage({
                        type: 'custom',
                        message: '加载失败，请刷新',
                        duration: 1000
                    });
                }
            },

            error(response) { //eslint-disable-line no-unused-vars
                this.curr = this.curr - 1;
                this.loadingText = false;
                this.loading = false;
            },

            appendData(list, items) {
                let item;

                for (let i = 0; i < list.length; i++) {
                    item = list[i];
                    if (item.recommendDate) {
                        item.recommendDate = format.formatDate(item.recommendDate, 'yyyy.MM.dd');
                    }
                    items.push(item);
                }
            },

            toRemind() {
                let id = doctorAuth.getDoctorInfo('chronicdDoctorId');
                Indicator.open();

                this.$http.post('/baseApi/doctor/remind', {
                    chronicdDoctorId: id
                }).then(
                    (response) => {
                        let res = response.data;
                        if (res.result === 0) {
                            this.remind = 1;
                            this.disableBtn = true;
                            Indicator.close();
                            util.showMessage({
                                type: 'custom',
                                message: '提醒成功!',
                                duration: 1000
                            });
                        } else {
                            this.remind = 0;
                            this.disableBtn = false;
                            Indicator.close();
                            util.showMessage({
                                type: 'custom',
                                message: '提醒失败，请稍后再试',
                                duration: 1000
                            });
                        }
                    },
                    (response) => { //eslint-disable-line no-unused-vars
                        this.remind = 0;
                        this.disableBtn = false;
                        Indicator.close();
                        util.showMessage({
                            type: 'custom',
                            message: '连接服务器失败，请稍后再试',
                            duration: 1000
                        });
                    }
                );
            }
        },

        mounted() {
            let item = doctorAuth.getDoctorInfo();

            if (item.exist == false) {
                this.isShowBlank = true;
            } else {
                Indicator.open();

                this.getData().then(
                    (response) => {
                        this.success(response);

                        if (this.items.length > 0) {
                            this.isFirst = false;
                        } else {
                            this.isShowBlank = true;
                        }
                        Indicator.close();
                    },
                    (response) => {
                        this.error(response);
                        this.isShowBlank = true;
                        Indicator.close();
                    }
                );
            }
        }
    };
</script>
