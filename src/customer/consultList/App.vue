<template>
    <div id="app">
        <div v-show="!isFirst">
            <div class="lists" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10" infinite-scroll-immediate-check="check">
                <div v-for="item in items" class="mint-cell item1" @click="chatView(item)">
                    <div class="top">
                        <div class="left">
                            <p>
                                <span class="name">{{item.dpConsult.patientRealName | realName}}</span>
                            </p>
                            <p class="special" v-text="item.lastMessage || ''"></p>
                        </div>
                        <div class="right" v-if="item.newMessageCount>0">
                            <p v-if="item.newMessageCount>99">
                                <span class="count">
                                    {{99}}<span class="more" v-text="'+'"></span>
                                </span>
                            </p>
                            <span v-else v-text="item.newMessageCount || 0" class="count"></span>
                        </div>
                    </div>

                    <div class="bottom">
                        <div class="left">
                            <p>
                                <span v-text="item.dpConsult.doctorRealName || ''" class="part"></span>
                                <span v-text="' | '" class="part"></span>
                                <span v-text="item.dpConsult.departmentName || ''" class="part"></span>
                            </p>
                        </div>
                        <div class="right">
                            <span class="part">{{item.createdTime | createdTime}}</span>
                        </div>
                    </div>
                </div>
            </div>

            <p v-show="loadingText || allLoaded" class="page-infinite-loading">
                <mt-spinner type="fading-circle" v-show="!allLoaded" :size="16"></mt-spinner>
                <span v-if="allLoaded">已全部加载完毕</span>
                <span v-if="!allLoaded">加载中...</span>
            </p>
        </div>

        <div class="blank" v-show="isShowBlank">
            <div>
                <img src="../../assets/img/blank-doctor.png">
                <h3>无咨询记录</h3>
                <p>没有查询到您与医生的咨询记录，请选择就医服务中的“找医生”。</p>
            </div>
        </div>

    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        padding: 0;
        -webkit-overflow-scrolling: touch;

        .mint-cell {
            margin: @gap/2 0;
            display: flex;
            background: @white;

            p {
                padding: 0.12rem 0;
                margin: 0;
            }

            .text {
                font-size: @fontSizeXs;
            }
            .name {
                color: @textColorBlack;
                font-size: @fontSizeBase;
            }
            .part {
                font-size: @fontSizeXs;
                color: @textColorLight;
            }
            .special {
                font-size: @fontSizeSm;
                color: @textColorBase;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

        }

        .item1 {
            padding: 0;
            display: block;
            .top, .bottom {
                display: flex;
                align-items: center;
                text-align: center;
            }

            .top {
                padding: 0.24rem @gapL;
            }
            .bottom {
                padding: 0 @gapL;
                align-items: center;

                p {
                    padding: @gap 0;
                    color: @textColorLight;
                    position: relative;
                }
            }
            .top {
                border-bottom: 1px solid @gray;

            }
            .left {
                flex: 6;
                text-align: left;
                overflow: hidden;
            }
            .right {
                flex: 1;

                .count {
                    background: #f96363;
                    font-size: @fontSizeXs;
                    border-radius: 50%;
                    color: @textColorWhite;
                    display: inline-block;
                    height: 26px;
                    width: 26px;
                    text-align: center;
                    line-height: 26px;
                    transform: scale(0.85);
                }
                .more {
                    position: relative;
                    top: -3px;
                    color: #fff;
                    font-size: @fontSizeXs;
                }
            }

        }

        .item1:first-child {
            margin-top: 0;
        }

    }

</style>

<script lang="babel">
    import Vue from 'vue';
    import { Indicator } from 'mint-ui';
    import userAuth from '../../common/userAuth';
    import util from '../../common/util';
    import format from '../../common/format';

    let consultUserId;
    //格式化时间
    Vue.filter('createdTime', function (value) {
        return format.formatDate(value) || '';
    });

    //格式化显示患者姓名
    Vue.filter('realName', function (value) {
        if (value && value.length > 5) {
            value = value.substring(0, 5) + '...';
        }
        return (value || '') + '的咨询';
    });

    export default {
        name: 'app',
        data() {
            return {
                loading: false,
                loadingText: false,
                allLoaded: false,
                isFirst: true,
                isShowBlank: false,
                curr: 0,
                size: 10,
                items: []
            };
        },

        methods: {
            //进入对话详情
            chatView(item) {
                util.changeLocation({
                    changeTo: 'im/index.html',
                    timeOut: 600,
                    query: {
                        roleCode: 1,
                        consultConversationId: item.consultConversationId
                    }
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
                            (response)=>this.success(response),
                            (response)=>this.error(response)
                    );
                }
            },

            getData() {
                this.loadingText = true;
                this.loading = true;
                this.curr = this.curr + 1;

                //http://192.168.11.187:8080/chronicd-server-api/v1/patient-chronicd-consult/consult-list?size=10&curr=1&consultUserId=10000287
                return this.$http.get('/baseApi/patient-chronicd-consult/consult-list', {
                    params: {
                        curr: this.curr,
                        size: this.size,
                        consultUserId: consultUserId
                    }
                });
            },

            success(response) {
                this.loadingText = false;
                this.loading = false;

                let res = response.body.data || {};
                if (response.body.result == 0) {
                    let results = res.results || [];
                    //全部已加载
                    if (this.curr >= res.totalPage && !this.isFirst) {
                        this.allLoaded = true;
                        this.loading = true;
                    }

                    this.appendData(results);
                } else {
                    this.curr = this.curr - 1;
                }
            },

            error(response) { //eslint-disable-line no-unused-vars
                this.curr = this.curr - 1;
                this.loadingText = false;
                this.loading = false;
            },

            appendData(list) {
                let items = this.items;
                let item;

                for (let i = 0; i < list.length; i++) {
                    item = list[i];

                    items.push(item);
                }
            }


        },

        mounted() {
            Indicator.open();

            consultUserId = userAuth.getUserInfo('id');

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
    };
</script>
