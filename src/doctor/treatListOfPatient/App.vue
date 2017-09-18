<template>
    <div id="app">
        <div v-show="!isFirst">
            <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="10" infinite-scroll-immediate-check="check">
                <li v-for="item in items">
                    <div class="top">
                    <span class="left">
                        <p>
                            <span class="time" v-text="item.date"></span>
                            <span class="part" v-text="item.medicalText"></span>
                        </p>
                        <p class="part" v-text="item.medicalInstitutions"></p>
                    </span>
                    </div>
                    <div class="middle">
                        <p v-text="item.medicalInfo"></p>
                    </div>
                    <div class="bottom">
                        <span v-for="(url,index) in item.attachments">
                            <img :src="url+'?x-oss-process=image/resize,m_fixed,h_80,w_80'"
                                 @click="picPreview(item.attachments, index)">
                        </span>
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
                <img src="../../assets/img/blank-treat.png">
                <h3>
                    患者暂无添加诊疗记录
                </h3>
            </div>
        </div>
    </div>

</template>

<style lang="less">
    @import "../../assets/css/common.less";

    #app {
        -webkit-overflow-scrolling: touch;

        .list {
            li {
                background: @white;
                margin-top: @gap;
                &:first-child {
                    margin-top: 0;
                }
                & > div {
                    padding: 0.32rem 0.4rem;
                }
            }
            .top {
                display: flex;
                background: #f4fcfd;
                align-items: center;
                border-bottom: 1px solid @borderColor;
                .left {
                    flex: 1;
                    .time {
                        color: @textColorBlack;
                        font-size: @fontSizeBase;
                        padding-right: 0.2rem;
                    }
                    .part {
                        color: @textColorBase;
                        font-size: @fontSizeXs;
                    }
                    p.part {
                        padding-top: 0.16rem;
                    }
                }
                .right {
                    width: 0.5rem;
                    img {
                        width: 0.5rem;
                    }

                }
            }
            .middle {
                p {
                    line-height: 1.5;
                }
            }
            .bottom {
                padding-top: 0;
                overflow: hidden;
                & > span {
                    width: 25%;
                    padding: 0.08rem 0.16rem 0.08rem 0;
                    display: inline-block;
                    float: left;
                    text-align: left;
                    height: 1.6rem;
                    position: relative;
                }

                img {
                    height: 100%;
                }

            }
        }
    }

    .fixDialog {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 1);
        z-index: 1000;

        .fixLeft {
            position: absolute;
            left: 0;
            z-index: 1000;
        }
        .fixRight {
            position: absolute;
            right: 0;
            z-index: 1000;
        }
        .fixBottom {
            position: absolute;
            left: 0;
            right: 0;
            max-width: 100%;
            max-height: 100%;
            z-index: 100;
        }
        img {
            top: 0;
            bottom: 0;
            margin: auto;
        }
    }
</style>

<script lang="babel">
    import {Indicator} from 'mint-ui';
    import util from '../../common/util';
    import format from '../../common/format';
    import http from '../../common/http'; //eslint-disable-line no-unused-vars

    function formatDate(val) {
        return format.formatDate(val, 'yyyy.MM.dd');
    }

    let medicalTypeList = ['首诊','复诊','手术','住院','出院','会诊','其他'];

    export default {
        name: 'app',
        data() {
            return {
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


                return this.$http.get('/baseApi/medicalrecord/list', {
                    params: {
                        curr: this.curr,
                        size: this.size,
                        patientId: id
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
                    if (res.data.isLast == 1 && !this.isFirst) {
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
                    item.date = formatDate(item.occurredTime);
                    item.medicalText = medicalTypeList[item.medicalType - 1];
                    items.push(item);
                }
            },

            picPreview(pics, index) {
                if (typeof WeixinJSBridge == 'undefined') {
                    this.pictureZoom(pics,index);
                } else {
                    WeixinJSBridge.invoke('imagePreview', { //eslint-disable-line no-undef
                        'current': pics[index],
                        'urls': pics
                    });
                }
            },

            //非微信端图片放大功能
            pictureZoom(pics,index) {
                let ind = index;
                var dom = document.createElement('div');
                dom.className = 'fixDialog';

                dom.innerHTML = '<span><img class="fixLeft" src="../src/assets/img/previous.png" /><img class="fixBottom" src="' + pics[ind] + '?x-oss-process=image/resize,w_1920/auto-orient,1" /><img class="fixRight" src="../src/assets/img/next.png" /></span>';
                document.body.appendChild(dom);

                var obj = document.getElementsByClassName('fixBottom')[0];
                obj.onclick = function () {
                    document.getElementsByClassName('fixDialog')[0].remove();
                };


                var left = document.getElementsByClassName('fixLeft')[0];
                //上一张
                left.onclick = function () {
                    ind--;
                    if (ind < 0) {
                        ind = pics.length - 1;
                    }
                    obj.src = pics[ind] + '?x-oss-process=image/resize,w_1920/auto-orient,1';
                };

                var right = document.getElementsByClassName('fixRight')[0];
                //下一张
                right.onclick = function () {
                    ind++;
                    if (ind == pics.length) {
                        ind = 0;
                    }
                    obj.src = pics[ind] + '?x-oss-process=image/resize,w_1920/auto-orient,1';
                };
            }
        },

        created() {
            util.setTitleByPatient(util.getParams('patientId'), {
                success: '{{patient}}的诊疗记录',
                fail: '患者诊疗记录'
            });
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
