<template>
    <div id="app" class="foot-fixed">
        <div v-show="!isFirst">
            <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="10" infinite-scroll-immediate-check="check">
                <li v-for="item in items" :class="item.stateClass">
                    <mt-cell :title="item.templateName" :label="item.date" @click.native="checkDetail($event, item)">
                        <span class="left">
                            <span v-text="item.stateText"></span>
                            <img class="arrow-right" src="../../assets/img/more.png">
                        </span>
                    </mt-cell>
                </li>
            </ul>

            <p v-show="loadingText || allLoaded" class="page-infinite-loading">
                <mt-spinner type="fading-circle" v-show="!allLoaded" :size="16"></mt-spinner>
                <span v-if="allLoaded">已全部加载完毕</span>
                <span v-if="!allLoaded">加载中...</span>
            </p>

            <div class="foot">
                <mt-button @click.native="add" type="primary" size="large">
                    添加随访计划
                </mt-button>
            </div>
        </div>

        <div class="blank" v-show="isShowBlank">
            <div>
                <img src="../../assets/img/blank-followup.png">
                <h3>
                    患者暂无随访计划
                </h3>
                <p>
                    一键添加，全程自动提醒患者复诊、注意事项
                </p>

                <mt-button @click.native="add" type="primary" size="large">
                    添加计划
                </mt-button>
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

        .mint-cell-label {
            font-size: @fontSizeSm;
            color: #939393;
            margin-top: 0.2rem;
        }

        .list {
            li {
                background: @white;
                margin-top: @gap;
                padding: 0.3rem 0;

                .mint-cell-text{
                    color: #333;
                    height: 0.32rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 4.2rem;
                    display: block;
                }

                .left {
                    display: flex;
                    align-items: center;
                    line-height: 1.6;
                    span {
                        font-size: 0.24rem;
                    }
                }

                &:first-child {
                    margin-top: 0;
                }

                &:last-child{
                    margin-bottom: 0.2rem;
                }

                &.processing {
                    .left span {
                        color: @blue;
                    }
                }

                &.finished {
                    .mint-cell-label, .mint-cell-text, .left span {
                        color: @textColorLight;
                    }
                }
            }
        }
    }
    .blank {
        .mint-button {
            border-radius: 0.08rem;
            height: 0.82rem;
            line-height: 0.82rem;
        }
    }
    .mint-cell {
        min-height: 0.96rem;
    }
</style>

<script lang="babel">
    import {Indicator} from 'mint-ui';
    import util from '../../common/util';
    import format from '../../common/format';
    import doctorAuth from '../../common/doctorAuth';

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd');
    }

    export default {
        name: 'app',
        data() {
            return {
                doctorId: '',
                patientId: '',

                loading: false,
                loadingText: false,
                allLoaded: false,
                check: false,
                isFirst: true,
                isShowBlank: false,

                curr: 0,
                size: 10,

                items: []
            };
        },
        methods: {
            add() {
                util.changeLocation({
                    changeTo: 'followUpTemplates.html',
                    timeOut: 600,
                    query: {
                        patientId: this.patientId,
                        patientName: util.getParams('patientName'),
                        device: util.getParams('device'),
                        chronicdDoctorId: this.doctorId
                    },
                    currWin: true
                });
            },

            checkDetail(event, item) {
                util.changeLocation({
                    changeTo: 'followUpDetailOfPatient.html',
                    timeOut: 600,
                    query: {
                        id: item.planTemplateId,
                        patientId: this.patientId,
                        patientName: util.getParams('patientName'),
                        device: util.getParams('device'),
                        chronicdDoctorId: this.doctorId
                    },
                    currWin: true
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
                let id = util.getParams('patientId');
                this.loadingText = true;
                this.loading = true;
                this.curr = this.curr + 1;


                return this.$http.get('/baseApi/doctor-follow-up/plan-list', {
                    params: {
                        curr: this.curr,
                        size: this.size,
                        patientId: id,
                        chronicdDoctorId: this.doctorId
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
                let item;

                for (let i = 0; i < list.length; i++) {
                    item = list[i];
                    item.date = '开始时间：' + formatDate(item.startDate);

                    if (item.endingFlag === 0) {
                        item.stateText = '随访中';
                        item.stateClass = 'processing';
                    } else {
                        item.stateText = '随访结束';
                        item.stateClass = 'finished';
                    }

                    items.push(item);
                }
            }
        },

        created() {
            this.patientId = util.getParams('patientId');

            util.setTitleByPatient(this.patientId, {
                success: '{{patient}}的随访计划',
                fail: '患者随访计划'
            });
        },

        mounted() {
            this.doctorId = doctorAuth.getDoctorId();

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
