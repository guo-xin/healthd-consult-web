<template>
    <div id="app">
        <!--<div class="nav">-->
        <!--<a href="javascript: void(0)" class="active" ><span>已报到患者</span></a>-->
        <!--<a href="javascript: void(0)" @click="goToVistorPatients"><span>未报到患者</span></a>-->
        <!--</div>-->
        <div v-show="!isFirst">
            <ul class="list">
                <li v-for="item in topItems" @click="checkDetail($event, item)"
                    :class="{assign: item.pdConsult.isAssign == 1}">
                    <div class="top">
                        <span class="left">
                            <span class="circle">
                                <img :src="item.pdConsult.patientHeadPic || defaultHead">
                            </span>
                        </span>
                        <span class="right">
                            <p class="name">
                                <span class="patient-name" v-text="item.pdConsult.patientRealName"></span>
                                <span class="msg-count" v-show="item.newMessageCount>0"
                                      v-text="item.msgCountText"></span>
                            </p>

                             <p class="date">
                                <span v-text="item.updateTime"></span>
                            </p>

                             <p class="text">
                                <span v-text="item.lastMessage || '无'"></span>
                            </p>
                        </span>
                    </div>
                    <div class="bottom">
                        <span>备注：</span><span v-text="item.pdConsult.tagName || '无'"></span>
                    </div>
                </li>
            </ul>

            <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="10" infinite-scroll-immediate-check="check">
                <li v-for="item in items" @click="checkDetail($event, item)"
                    :class="{assign: item.pdConsult.isAssign == 1}">
                    <div class="top">
                        <span class="left">
                            <span class="circle">
                                <img :src="item.pdConsult.patientHeadPic || defaultHead">
                            </span>
                        </span>
                        <span class="right">
                            <p class="name">
                                <span class="patient-name" v-text="item.pdConsult.patientRealName"></span>
                                <span class="msg-count" v-show="item.newMessageCount>0"
                                      v-text="item.msgCountText"></span>
                            </p>

                             <p class="date">
                                <span v-text="item.updateTime"></span>
                            </p>

                             <p class="text">
                                <span v-text="item.lastMessage || '无'"></span>
                            </p>
                        </span>
                    </div>
                    <div class="bottom">
                        <span>备注：</span><span v-text="item.pdConsult.tagName || '无'"></span>
                    </div>
                </li>
            </ul>

            <p v-show="loadingText || allLoaded" class="page-infinite-loading">
                <mt-spinner type="fading-circle" v-show="!allLoaded" :size="16"></mt-spinner>
                <span v-if="allLoaded">已全部加载完毕</span>
                <span v-if="!allLoaded">加载中...</span>
            </p>
        </div>

        <div class="blank" v-show="isShowBlank">
            <div>
                <img src="../../assets/img/blank-patient.png">
                <h3>
                    尚未有患者与您关联
                </h3>
            </div>
        </div>

    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        padding-top: 0;
        -webkit-overflow-scrolling: touch;
    }

    .list {
        .circle {
            background: #eee;
        }

        .mint-button {
            width: 1.28rem;
            text-align: center;
            height: 0.64rem;
            line-height: 0.64rem;
            margin-left: 0.1rem;
        }

        li {
            margin-bottom: @gap;
            background: #fff;
            padding-left: 0.4rem;
            position: relative;

            &.assign:after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                display: block;
                background: url(../../assets/img/icon-top.png) top left no-repeat;
                background-size: 100% auto;
                width: 0.48rem;
                height: 0.48rem;
            }
        }

        .top {
            display: flex;
            border-bottom: 1px solid @borderColor;
            padding: 0.24rem 0.4rem 0.24rem 0;
        }

        .left {
            width: 1.6rem;
            display: block;
        }

        .right {
            flex: 1;
            overflow: hidden;
            padding-top: 0.12rem;
            display: block;

            .name {
                font-size: @fontSizeBase;
                color: @textColorBlack;
                margin-bottom: 0.18rem;
                position: relative;
                line-height: 100%;

                .patient-name {
                    width: 100%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    display: inline-block;
                    padding-right: 0.72rem;
                }
                .msg-count {
                    position: absolute;
                    right: 0;
                    top: -50%;
                    display: block;
                    width: 0.72rem;
                    height: 0.72rem;
                    background: red;
                    border-radius: 50%;
                    font-size: 0.36rem;
                    line-height: 0.72rem;
                    text-align: center;
                    color: #fff;
                    transform: scale(0.6);
                }
            }

            .date {
                font-size: @fontSizeXs;
                color: @textColorLight;
                margin-bottom: 0.22rem;
                line-height: 100%;
            }

            .text {
                font-size: @fontSizeSm;
                color: @textColorBase;
                height: 0.3rem;
                line-height: 100%;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .bottom {
            padding: 0.24rem 0.4rem 0.24rem 0;
            font-size: @fontSizeXs;
            color: @textColorLight;
        }
    }

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

    .blank {
        top: 1.3rem;
    }
</style>

<script lang="babel">
    import { Indicator } from 'mint-ui';
    import format from '../../common/format';
    import doctorAuth from '../../common/doctorAuth';
    import util from '../../common/util';

    export default {
        name: 'app',
        data() {
            return {
                requestList: [],

                defaultHead: require('../../assets/img/head-patient.png'), //eslint-disable-line no-undef
                loading: false,
                loadingText: false,
                allLoaded: false,
                check: false,
                isFirst: true,
                isShowBlank: false,

                curr: 0,
                size: 10,

                topItems: [],
                items: []
            };
        },
        methods: {
            goToVistorPatients() {
                util.changeLocation({
                    changeTo: 'myVisitorPatients.html',
                    timeout: 600
                });
            },

            loadMore() {
                if (!this.allLoaded) {
                    let el = document.querySelector('.page-infinite-loading');
                    el.style.display = '';
                    if (el.scrollIntoView) {
                        el.scrollIntoView({block: 'end', behavior: 'smooth'});
                    }
                    this.getData().then(
                        (response) => this.success(response),
                        (response) => this.error(response)
                    );
                }
            },

            getData() {
                let id = doctorAuth.getDoctorInfo('chronicdDoctorId');
                this.loadingText = true;
                this.loading = true;
                this.curr = this.curr + 1;

                return this.$http.get('/baseApi/doctor-chronicd-consult/consult-list', {
                    params: {
                        curr: this.curr,
                        size: this.size,
                        isAssign: -1,
                        consultDoctorId: id
                    }
                });
            },

            success(response) {
                this.loadingText = false;
                this.loading = false;

                let res = response.data;

                if (res.result === 0) {
                    let results = (res.data || {}).results || [];

                    //全部已加载
                    if ((results.length == 0 || this.curr * this.size >= res.data.total) && !this.isFirst) {
                        this.allLoaded = true;
                        this.loading = true;
                    }
                    this.appendData(results, this.items);
                } else {
                    this.curr = this.curr - 1;
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
                    item.pdConsult = item.pdConsult || {};
                    if (item.pdConsult.tagName) {
                        item.pdConsult.tagName = item.pdConsult.tagName.split(',').join('/');
                    }
                    if (item.updateTime) {
                        item.updateTime = format.formatDate(item.updateTime, 'yyyy.MM.dd');
                    }
                    item.msgCountText = item.newMessageCount > 99 ? '99+' : item.newMessageCount;
                    items.push(item);
                }
            },

            checkDetail(event, item) {
                util.changeLocation({
                    changeTo: 'im/index.html',
                    timeOut: 600,
                    query: {
                        roleCode: 0,
                        consultConversationId: item.consultConversationId
                    }
                });
            },

            getTops() {
                let id = doctorAuth.getDoctorInfo('chronicdDoctorId');
                this.$http.get('/baseApi/doctor-chronicd-consult/consult-list', {
                    params: {
                        curr: 1,
                        size: 20,
                        isAssign: 1,
                        consultDoctorId: id
                    }
                }).then(
                    (response) => {
                        let res = response.data;
                        if (res.result === 0) {
                            let results = (res.data || {}).results || [];
                            this.appendData(results, this.topItems);
                        }
                        this.allResponse();
                    },
                    () => {
                        this.allResponse();
                    }
                );
            },

            //初始数据时所有请求都返回时调用
            allResponse() {
                let list = this.requestList;
                list.push(1);

                if (list.length > 1) {
                    if (this.topItems.length == 0 && this.items.length == 0) {
                        this.isShowBlank = true;
                    } else {
                        this.isFirst = false;
                    }
                    Indicator.close();
                }
            }
        },

        mounted() {
            let item = doctorAuth.getDoctorInfo();

            if (item.exist == false) {
                this.isShowBlank = true;
            } else {
                Indicator.open();
                this.getTops();

                this.getData().then(
                    (response) => {
                        this.success(response);
                        this.allResponse();
                    },
                    (response) => {
                        this.error(response);
                        this.allResponse();
                    }
                );
            }
        }
    };
</script>
