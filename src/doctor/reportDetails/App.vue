<template>
    <div id="app" class="foot-fixed">
        <div class="basis">
            <div class="time">
                <div class="btn" @click="openPicker">
                    <span v-text="date"></span>
                    <span class="arrow"><img src="../../assets/img/time-bottom.png"></span>
                </div>
            </div>
            <div class="number" v-text="total"></div>
            <div class="note">本月报到患者（人）</div>
        </div>
        <mt-datetime-picker
                type="date"
                ref="picker"
                v-model="selectedDate"
                :endDate="endDate"
                :startDate="startDate"
                @confirm="confirmDate"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                >
        </mt-datetime-picker>



        <ul class="user" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="10" infinite-scroll-immediate-check="check">
            <li v-for="item in items" class="consult">
                <span class="left">
                    <span class="circle">
                        <img :src="item.headPic || defaultHead">
                    </span>
                </span>
                <span class="right">
                    <p class="title">
                        <span class="name" v-text="item.realName"></span>
                    </p>
                    <p class="content" >
                        备注：<span v-for="(content, index) in item.remark">{{content}}{{index + 1 >= item.remark.length ? '' : ','}}</span>
                    </p>
                </span>
            </li>
        </ul>

    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        font-size: @fontSizeBase;
        padding-top: 0;
    }
    #app.foot-fixed {
        bottom: 0;
    }
    .mint-button.is-disabled{
    img{
        opacity: 0.3;
    }
    }
    .picker-slot:nth-child(3) {
        display: none;
    }
    .basis {
        padding: 0.45rem 0 0.49rem 0rem;
        background-image:linear-gradient(8deg, #2ec4e9 0%, #0a8bd6 100%);
        .time {
            padding-left: 0.4rem;
            text-align: left;
            .btn {
                display: inline-block;
                border-radius:1rem;
                padding: 0.11rem 0.27rem 0.11rem 0.2rem;
                background: rgba(255,255,255,0.15);
                color: #fff;
                font-size: 0.28rem;
                .arrow {
                    img {
                        width: 0.18rem;
                        height: 0.11rem;
                    }
                }
            }
            margin-bottom: 0.5rem;
        }
        .number {
            font-size:1.3rem;
            color:#fff;
            line-height:1rem;
            text-align:center;
            margin-bottom: 0.24rem;
        }
        .note {
            opacity:0.6;
            font-size:0.24rem;
            color:#fff;
            line-height:0.22rem;
            text-align:center;
        }
    }

    .profile {
        background: #fff;
        font-size: @fontSizeSm;
        color: @textColorBase;
        padding: 0.35rem 0.3rem 0.35rem 0.4rem;
    .paragraph {
        max-height: 1.43rem;
        overflow: hidden;
    }
    .allDisplay {
        max-height: none;
    }
    .speciality, .introduce {
        line-height: 0.42rem;
    .text {
        color: #000;
    }
    }
    .speciality {
        margin-bottom: 0.17rem;
    }
    .item {
        background: #fff;
        margin-bottom: 1px;
        padding: 0.3rem;
        line-height: 0.42rem;

    .field {
        float: left;
        text-align: left;
        color: #333;
        width: 1rem;
        padding-right: 0.12rem;
        display: block;
    }

    .text {
        display: block;
        margin-left: 1rem;
        padding: 0 0.2rem 0 0.12rem;
        min-height: 0.42rem;
    }
    }
    }
    .consult {
    &:active {
         background: @bgHoverColor;
     }
        display: flex;
        align-items: center;
        padding: 0.3rem 0.3rem 0.3rem 0.3rem;
        background: #fff;
        border-bottom:1px solid #ececec;
        &:last-child {
            border-bottom: none;
        }
    .circle {
        width: 0.8rem;
        height: 0.8rem;
        background: @textColorBlue;
        border-radius: 100%;
    }

    .left {
        display: block;
        width: 0.8rem;
        text-align: center;
        margin-right: 0.3rem;
    }

    .right {
        flex: 1;
        overflow: hidden;
        display: block;
    .title {
        font-size: @fontSizeBase;
        color: @textColorBlack;
        display: flex;
        align-items: center;
        margin-bottom: 0.15rem;
    .name, .price {
        flex: 1;
        display: block;
    }
    .name {
        font-size: @fontSizeBase;
        text-align: left;
        line-height: @fontSizeBase;
        color: @textColorBlack;
    }
    .price {
        font-size: 0.26rem;
        line-height: @fontSizeSm;
        text-align: right;
        color: #ff8903;
    }
    }

    .content {
        font-size: 0.26rem;
        color: @textColorBase;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    }
    }
    .foot {
    button {
    &:active {
         background-color: #2BB4D5;
     }
    }
    }
</style>

<script lang="babel">
    import util from '../../common/util';

    export default {
        name: 'app',
        data() {
            return {
                defaultHead: require('../../assets/img/head-doctor.png'), //eslint-disable-line no-undef
                disableBtn: true,
                item: {},
                selectedDate: new Date(),
                endDate: new Date(),
                startDate: new Date('2016/01/01'),
                date: null,
                loading: false,
                loadingText: false,
                allLoaded: false,
                check: false,
                curr: 0,
                size: 10,
                isFirst: true,

                total: 0,
                ts: 0,
                from: 0,
                to: 0,

                items: []
            };
        },
        methods: {
            openPicker() {
                this.$refs.picker.open();
            },

            confirmDate(val) {
                var month = val.getMonth();
                this.date = val.getFullYear() + '年' + (month + 1) + '月';

                val = val.setDate(1);
                val = new Date(val);
                this.from = val.getTime();
                this.to = val.setMonth(month + 1);
                this.curr = 0;
                this.ts = 0;
                this.items = [];
                this.total = 0;
                this.allLoaded = false;
                this.loadMore();
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
                let id = util.getParams('doctorId');

                if (this.curr > 1) {
                    this.isFirst = false;
                }
                return this.$http.get('/baseApi/doctor/patient/checkin/list', {
                    params: {
                        curr: this.curr,
                        size: this.size,
                        ts: this.ts,
                        from: this.from,
                        to: this.to,
                        doctorId: id
                    }
                });
            },

            success(response) {
                this.loading = false;

                let res = response.data;

                if (res.result === 0) {
                    let results = (res.data || {}).patients || [];
                    this.total = res.data.total;
                    //全部已加载
                    if ((results.length == 0 || this.curr * this.size >= res.data.total) && !this.isFirst) {
                        this.allLoaded = true;
                        this.loading = true;
                    }
                    this.ts = res.data.refreshTime;
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
                    items.push(item);
                }
            }
        },

        mounted() {
            var time = new Date();
            var month = time.getMonth();
            this.date = time.getFullYear() + '年' + (month + 1) + '月';
            time = time.setDate(1);
            time = new Date(time);
            this.from = time.getTime();
            this.to = time.setMonth(month + 1);
            this.loadMore();
        }
    };
</script>
