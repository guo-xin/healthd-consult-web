<template>
    <div id="app" class="foot-fixed">

        <div v-show="!isFirst">
            <div class="notice">
                <p>建议您每天记录您的血压数据，以便医生了解您的病情，指导您后续治疗</p>
                <div>
                    <img src="../../assets/img/icon-illustrate.png"><a href="javascript: void(0)"
                                                                       @click="openIntroduction">说明</a>
                </div>
            </div>

            <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10" infinite-scroll-immediate-check="check">

                <template v-for="item in items">

                    <div class="day" v-if="item.dataType=='date'" v-text="item.date"></div>

                    <mt-cell title="" @click.native="checkDetail($event, item)" v-else>
                    <span>
                        <span>
                            {{item.lowPressure}}/{{item.highPressure}}mmHg
                        </span>

                        <span v-show="item.bp.isHigh">
                            <span class="split">|</span>
                            <span class="state" :style="{color: item.bp.color}" v-text="item.bp.text"></span>
                        </span>
                    </span>

                        <span>
                        <span v-text="item.time"></span>
                        <img class="arrow-right" src="../../assets/img/more.png">
                    </span>
                    </mt-cell>

                </template>
            </div>

            <p v-show="loadingText || allLoaded" class="page-infinite-loading">
                <mt-spinner type="fading-circle" v-show="!allLoaded" :size="16"></mt-spinner>
                <span v-if="allLoaded">已全部加载完毕</span>
                <span v-if="!allLoaded">加载中...</span>
            </p>

            <div class="foot">
                <mt-button @click.native="add" type="primary" size="large">
                    添加血压数据
                </mt-button>
            </div>

            <div class="info" v-show="isShowIntroduction">
                <div class="content">
                    <dl>
                        <dt>
                            正常高值
                        </dt>
                        <dd>
                            <p>
                                根据2005年中国高血压治疗指南建议的标准，把从120mmHg-139mmHg以及舒张压80mmHg-89mmHg的范畴之内定为“正常高值”。
                            </p>
                            <p>
                                血压值处于这一范围之内，虽属正常但已相对偏高，要注意改变生活方式，如：少吃盐、注重减肥、增加体育锻炼、少喝酒等。
                            </p>
                        </dd>
                        <dt>
                            偏高
                        </dt>
                        <dd>
                            <p>
                                当自测或筛查时血压高于140/90mmHg，请前往正规医院的心内科去确诊。一旦确诊为高血压，除改变不良的生活习惯外，限盐、戒烟戒酒、减肥、早睡、运动等都要写上日程表，同时及时开始药物治疗，使血压达标，减少心脑血管损害。
                            </p>
                        </dd>
                        <dt>
                            极高
                        </dt>
                        <dd>
                            <p>当自测或筛查时血压高于180/110mmHg，请立即前往正规医院治疗。</p>
                        </dd>
                    </dl>
                    <div class="close">
                        <a href="javascript:void(0)"><img src="../../assets/img/icon-close.png"
                                                          @click="closeIntroduction"></a>
                    </div>
                </div>

            </div>
        </div>


        <div class="blank" v-show="isShowBlank">
            <div>
                <img src="../../assets/img/blank-bp.png">
                <h3>
                    您还没有添加血压数据
                </h3>
                <p>
                    建议您每天记录血压数据，方便医生了解您的情况，以便医生更好的为您服务。
                </p>

                <mt-button @click.native="add" type="primary" size="large">
                    开始记录
                </mt-button>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

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
    }

    .notice {
        padding: 0.2rem 0.4rem;
        font-size: @fontSizeXs;

        p {
            color: @textColorLight;
            line-height: 1.4;
        }

        div {
            text-align: right;
            a {
                color: @blue;
            }
        }

        img {
            height: 0.28rem;
            vertical-align: -0.06rem;
            margin-right: 0.04rem;
        }
    }

    .list {
        .mint-cell:last-child {
            margin-bottom: 0.2rem;
        }

        .day {
            padding-left: 0.4rem;
            height: 0.96rem;
            line-height: 0.96rem;
            background: #fff;
            margin-top: @gap;
            color: @textColorBlack;
            font-size: @fontSizeSm;
        }

        .mint-cell-value {
            width: 100%;
            overflow: hidden;
            justify-content: space-between;

            & > span {
                display: flex;
                align-items: center;
                line-height: 1.6;
            }
        }

        .split {
            margin: 0 0.1rem 0 0.2rem;
            color: @borderColor;
        }

        .state {
            &.danger {
                color: #ff5858;;
            }
        }
    }

    .info {
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(32, 32, 32, 0.50);
        width: 100%;
        height: 100%;
        padding: 0.4rem 0.4rem 1.2rem 0.4rem;
        display: flex;
        align-items: center;
        z-index: 11;

        .content {
            background: #ffffff;
            border-radius: 0.08rem;
            width: 100%;
            height: auto;
            padding: 0.5rem 0.4rem;
            position: relative;
        }

        dt {
            font-size: @fontSizeSm;
            color: @textColorBlack;
            line-height: 0.56rem;
            margin: 0.2rem 0 0;
        }

        dd {
            font-size: @fontSizeXs;
            line-height: 0.36rem;

            p {
                margin-bottom: 0.12rem;
            }

            p:last-child {
                margin-bottom: 0;
            }
        }

        .close {
            position: absolute;
            left: 0;
            bottom: -1rem;
            width: 100%;
            text-align: center;

            img {
                height: 0.64rem;
            }
        }
    }

    .blank {
        .mint-button {
            border-radius: 0.08rem;
            height: 0.81rem;
            line-height: 0.81rem;
        }
    }

    .list .day + .mint-cell .mint-cell-wrapper {
        background: none;
    }

    .list .day {
        border-bottom: 1px solid @borderColor;
    }

    .mint-cell img {
        vertical-align: baseline;
    }

</style>

<script lang="babel">
    import { Indicator } from 'mint-ui';
    import format from '../../common/format';
    import util from '../../common/util';
    import userAuth from '../../common/userAuth';

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd');
    }

    function formatTime(val) {
        return format.formatDate(val, 'HH:mm');
    }

    function formatBP(low, high, age) {
        return format.formatBP(low, high, age);
    }

    export default{
        data() {
            return {
                loading: false,
                loadingText: false,
                allLoaded: false,
                check: false,
                isFirst: true,
                isShowBlank: false,
                isShowIntroduction: false,

                curr: 0,
                size: 10,

                items: []
            };
        },

        methods: {
            openIntroduction() {
                this.isShowIntroduction = true;
            },

            closeIntroduction() {
                this.isShowIntroduction = false;
            },

            add() {
                util.changeLocation({
                    changeTo: 'addBloodPressure.html',
                    timeOut: 600
                });
            },

            checkDetail(event, item) {
                util.changeLocation({
                    changeTo: 'editBloodPressure.html',
                    timeOut: 600,
                    query: {
                        id: item.id
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
                        (response) => this.success(response),
                        (response) => this.error(response)
                    );
                }
            },

            getData() {
                this.loadingText = true;
                this.loading = true;
                this.curr = this.curr + 1;
                this.age = parseInt(format.formatAge(userAuth.getUserInfo('birthday')));

                return this.$http.get('/baseApi/health-data/blood-pressure-list', {
                    params: {
                        curr: this.curr,
                        size: this.size,
                        patientId: userAuth.getUserInfo('patientId')
                    }
                });
            },

            success(response) {
                this.loadingText = false;
                this.loading = false;

                let res = response.data;

                if (res.result === 0) {
                    let data = res.data || {};
                    let results = data.results || [];
                    let total = data.total || 0;

                    //全部已加载
                    if (this.curr * this.size >= total && !this.isFirst) {
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
                let lastItem = items[items.length - 1];
                let item;
                let age = parseInt(format.formatAge(userAuth.getUserInfo('birthday')));

                for (let i = 0; i < list.length; i++) {
                    item = list[i];
                    item.time = formatTime(item.measurementTime);
                    item.date = formatDate(item.measurementTime);
                    item.bp = formatBP(item.lowPressure, item.highPressure, age);

                    if (!lastItem || (lastItem && lastItem.date != item.date)) {
                        items.push({
                            dataType: 'date',
                            date: item.date
                        });

                        lastItem = item;
                    }

                    items.push(item);
                }
            }
        },

        mounted() {
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
    };
</script>
