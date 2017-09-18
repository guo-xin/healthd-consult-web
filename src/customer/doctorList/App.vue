<template>
    <div id="app">
        <div v-show="!isFirst">
            <div class="dList" :class="{showList:isShow}">
                <div class="top" :value="departmentIds" @click="changeStatus()">
                    <span v-text="name"></span>
                    <img v-if="isShow" src="../../assets/img/top.png">
                    <img v-else src="../../assets/img/bottom.png">
                </div>
                <div class="dialog" v-show="isShow">
                    <ul>
                        <li class="list" v-show="departmentIds"
                            value="" v-text="'全部科室'"
                            @click="choose()">
                        </li>
                        <li class="list" v-show="item.id !== departmentIds" v-for="item in departmentList"
                            :value="item.id" v-text="item.departmentName"
                            @click="choose(item)">
                        </li>
                    </ul>
                </div>
            </div>

            <div class="lists" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                 infinite-scroll-distance="10" infinite-scroll-immediate-check="check">
                <div v-for="item in items" :key="item.id" class="mint-cell item1" @click="doctorDetail($event,item)">
                    <div class="left">
                        <span class="circle">
                            <img slot="icon"
                                 :src="item.headPic?item.headPic+'?x-oss-process=image/resize,w_60/auto-orient,1':defaultHead">
                        </span>
                    </div>
                    <div class="center">
                        <p v-text="item.realName || ''" class="name"></p>
                        <p>
                            <span v-text="item.department || ''" class="part"></span>
                            <span v-text="' | '" class="part"></span>
                            <span v-text="item.jobTitle || ''" class="part"></span>
                        </p>
                        <p v-text="'擅长：'+(item.specialSkill || '')" class="special"></p>
                    </div>
                    <div class="right">
                        <p v-text="item.chronicdServiceCount || 0" class="count"></p>
                        <p v-text="'已服务'" class="text"></p>
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
                <h3>
                    暂无医生
                </h3>
                <p>
                    抱歉，没有合适的医生为您服务
                </p>
            </div>
        </div>

    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        padding: 0;
        overflow-y: inherit;
        -webkit-overflow-scrolling: touch;

        .dList {
            height: 50px;
            width: 100%;
            position: fixed;
            left: 0;
            top: 0;
            text-align: center;
            z-index: 999;

            .top {
                border-top: #dbdbdb 1px solid;
                color: @textColorBlack;
                font-size: @fontSizeBase;
                position: fixed;
                top: 0;
                width: 100%;
                vertical-align: middle;
                height: 50px;
                line-height: 50px;
                box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
                background: #fff;
                z-index: 999;

                img {
                    padding-left: @gap;
                    width: @gapL*2;
                }
            }

            .dialog {
                position: absolute;
                height: 100%;
                width: 100%;
                top: 0;
                left: 0;
                background: rgba(0, 0, 0, .5);
                z-index: 100;
            }
            ul {
                position: relative;
                z-index: 999;
                list-style: none;
                margin: 0;
                margin-top: 50px;
                padding: 0;
                vertical-align: middle;
                box-shadow: 0 0 4px rgba(0, 0, 0, .2);

                li {
                    background: #fff;
                    border-top: @gray 1px solid;
                    height: 50px;
                    line-height: 50px;
                }

                .list {
                    font-size: @fontSizeSm;
                    color: @textColorBase;
                    z-index: 999;
                    &:link, &:active, &:hover {
                        color: @blue;
                        background: #fafafa;
                    }
                }
            }
        }

        .showList {
            height: 100%;
            overflow-y: scroll;
        }
        .lists {
            margin-top: 50px;
        }
        .mint-cell {
            margin: @gap/2 0;
            padding: @gapL;
            display: flex;
            background: @white;

            p {
                margin: 0;
            }

            .text {
                font-size: @fontSizeXs;
            }
            .name {
                color: @textColorBlack;
                font-size: @fontSizeBase;
                padding: 0 0.28rem;
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
                padding-right: 0;
            }

            .status {
                font-size: @fontSizeXs;
                color: @blue;
            }
        }

        .item1 {
            padding-right: 6px;
            p {
                padding: 0.06rem @gapL;
            }

            .left {
                width: @imgWith;
                img {
                    width: @imgWith;
                }
            }
            .center {
                flex: 1;
                text-align: left;
                overflow: hidden;

            }
            .right {
                width: @imgWith;
                text-align: center;
                p {
                    padding: 0;
                    color: @textColorBase;
                }
            }
            .count {
                font-size: @fontSizeLg;
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
                defaultHead: require('../../assets/img/head-doctor.png'), //eslint-disable-line no-undef
                loading: false,
                loadingText: false,
                allLoaded: false,
                check: false,
                isFirst: true,
                isShowBlank: false,
                curr: 0,
                size: 20,
                items: [],
                departmentIds: null,
                name: '全部科室',
                isShow: false,//科室选择悬浮显示与隐藏
                departmentList: []//科室列表,全科1,呼吸科54,骨科7,急诊科52,肾内科56,神经内科55
            };
        },

        watch: {
            'departmentIds': function () {
                this.curr = 0;
                this.allLoaded = false;
                this.isShowBlank = false;
                this.items = [];

                this.getData().then(
                        (response)=> {
                            this.success(response);
                            if (this.items.length == 0) {
                                this.isShowBlank = true;
                            }
                        },
                        (response)=>this.error(response)
                );
            }
        },
        methods: {
            //选择科室
            choose: function (item) {
                if (item) {
                    this.departmentIds = item.id;
                    this.name = item.departmentName;
                } else {
                    this.departmentIds = null;
                    this.name = '全部科室';
                }
                this.isShow = false;
            },

            //切换下拉框的显示与隐藏
            changeStatus: function () {
                if (this.isShow) {
                    this.isShow = false;
                } else {
                    this.isShow = true;
                }
            },

            loadMore() {
                if (!this.allLoaded) {
                    this.getData().then(
                            (response)=>this.success(response),
                            (response)=>this.error(response)
                    );
                }
            },

            getData() {
                let isTest = userAuth.getUserInfo('isTest');
                this.loadingText = true;
                this.loading = true;
                this.curr = this.curr + 1;

                //http://192.168.11.187:8080/chronicd-server-api/v1/doctor/services?size=10&curr=1&isTest=0
                return this.$http.get('/baseApi/doctor/services', {
                    params: {
                        curr: this.curr,
                        size: this.size,
                        isTest: isTest,
                        departmentIds: this.departmentIds
                    }
                });
            },

            success(response) {
                this.loadingText = false;
                this.loading = false;

                let res = response.body.data || {};
                if (response.body.result == 0) {
                    let results = res.results;

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
            },

            //进入医生详情
            doctorDetail(event, item) {
                util.changeLocation({
                    changeTo: 'doctorDetail.html',
                    timeOut: 600,
                    query: {
                        chronicdDoctorId: item.chronicdDoctorId
                    }
                });
            },

            //科室列表
            getDepartmentList() {
                this.loadingText = true;
                //http://192.168.11.187:8080/chronicd-server-api/v1/departments
                return this.$http.get('/baseApi/departments');
            },

            //过滤显示科室 全科1,呼吸科54,骨科7,急诊科52,肾内科56,神经内科55
            formatDepartment(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == 1 || data[i].id == 54 || data[i].id == 7 || data[i].id == 52 || data[i].id == 56 || data[i].id == 55) {
                        this.departmentList.push(data[i]);
                    }
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
                    },
                    (response) => {
                        this.error(response);

                        this.isShowBlank = true;
                    }
            ).then(()=> {
                this.getDepartmentList().then((responses)=> {
                    let res = responses.data;
                    this.formatDepartment(res.data || []);

                    this.loadingText = false;
                    Indicator.close();
                });
            }).then(()=> {
                //dialog显示时，禁止医生列表滑动
                let dialog = document.querySelector('.dialog');
                dialog.addEventListener('touchmove', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            });
        }
    };
</script>
