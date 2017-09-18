<template>
    <div id="app">

        <div v-show="!isFirst">

            <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10" infinite-scroll-immediate-check="check">

                <template v-for="item in items">

                    <div class="day" v-if="item.dataType=='date'" v-text="item.date"></div>

                    <mt-cell title="" v-else @click.native="checkDetail($event, item)">
                    <span>
                        <span>
                            {{item.lowPressure}}/{{item.highPressure}}mmHg
                        </span>

                        <span v-show="item.bp.isHigh">
                            <span class="split">|</span>
                            <span class="state" v-bind:style="{color: item.bp.color}" v-text="item.bp.text"></span>
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
        </div>


        <div class="blank" v-show="isShowBlank">
            <div>
                <img src="../../assets/img/blank-bp.png">
                <h3>
                    患者暂无添加血压数据
                </h3>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        -webkit-overflow-scrolling: touch;
    }

    .list {
        .mint-cell:last-child {
            margin-bottom: 0.2rem;
        }

        .day {
            border-bottom: 1px solid #ECECEC;
            padding-left: 0.4rem;
            height: 0.96rem;
            line-height: 0.96rem;
            background: #fff;
            margin-top: @gap;
            color: @textColorBlack;
            font-size: @fontSizeSm;

            &:first-child {
                margin-top: 0;
            }
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
            color: #ECECEC;
        }

        .state {
            &.danger {
                color: #ff5858;;
            }
        }
    }

    .list .day + .mint-cell .mint-cell-wrapper {
        background: none;
    }

    .mint-cell img {
        vertical-align: baseline;
    }
</style>

<script lang="babel">
    import format from '../../common/format';
    import util from '../../common/util';
    import { Indicator } from 'mint-ui';

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd');
    }

    function formatTime(val) {
        return format.formatDate(val, 'HH:mm');
    }

    function formatBP(low, high, age) {
        return format.formatBP(low, high, age);
    }

    export default {
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
                size: 15,

                items: []
            };
        },

        methods: {
            checkDetail(event, item) {
                let url = `bloodPressureDetailOfPatient.html?id=${item.id}`;
                let name = util.getParams('patientName');
                let device = util.getParams('device');

                if (name) {
                    url += `&patientName=${name}`;
                }

                if (device) {
                    url += `&device=${device}`;
                }

                util.changeLocation({
                    changeTo: url,
                    timeOut: 600,
                    currWin: true
                });
                //window.location.href = url;
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

                return this.$http.get('/baseApi/health-data/blood-pressure-list', {
                    params: {
                        curr: this.curr,
                        size: this.size,
                        patientId: util.getParams('patientId')
                    }
                });
            },

            success(response) {
                this.loadingText = false;
                this.loading = false;

                let res = response.data;

                if (res.result === 0) {
                    let results = res.data.results;

                    //全部已加载
                    if (this.curr * this.size >= res.data.total && !this.isFirst) {
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

                for (let i = 0; i < list.length; i++) {
                    item = list[i];
                    item.time = formatTime(item.measurementTime);
                    item.date = formatDate(item.measurementTime);
                    item.bp = formatBP(item.lowPressure, item.highPressure, this.patient.age);

                    if (!lastItem || (lastItem && lastItem.date != item.date)) {
                        items.push({
                            dataType: 'date',
                            date: item.date
                        });
                        lastItem = item;
                    }
                    items.push(item);
                }
            },
            getPatientAge() {
                return this.$http.get('/baseApi/doctor-patient/patient-ext', {
                    params: {
                        patientId: util.getParams('patientId')
                    }
                }).then(
                    (response) => {
                        let res = response.data;
                        if (res.result == 0) {
                            let data = res.data;

                            this.patient = data.patient || {};
                            this.patient.age = parseInt(format.formatAge(this.patient.birthday));
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
                    }
                );
            }
        },

        created() {
            util.setTitleByPatient(util.getParams('patientId'), {
                success: '{{patient}}的血压记录',
                fail: '患者血压记录'
            });
        },

        mounted() {
            Indicator.open();
            this.getPatientAge().then(
                (response) => { //eslint-disable-line no-unused-vars
                    this.getData().then(
                        (response) => { //eslint-disable-line no-shadow
                            this.success(response);

                            if (this.items.length > 0) {
                                this.isFirst = false;
                            } else {
                                this.isShowBlank = true;
                            }

                            Indicator.close();
                        },
                        (response) => { //eslint-disable-line no-shadow
                            this.error(response);
                            this.isShowBlank = true;
                            Indicator.close();
                        }
                    );
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
