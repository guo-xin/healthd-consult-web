<template>
    <div id="app">
        <div class="section">
            <ul class="list">
                <li>
                    <h3>Q1 : 积分是什么</h3>
                    <div class="content">积分是平台对每个医生给予补贴的重要依据。通过给患者提供医疗服务，可以得到相应积分。使用积分可以向平台兑换各种福利。</div>
                </li>
                <li>
                    <h3>Q2 : 积分的作用</h3>
                    <div class="content">1.换取奖金；<br>2.换取礼品；<br>3.旅游奖励。</div>
                </li>
                <li>
                    <div class="flex-col">
                        <h3>Q3 : 积分规则</h3>
                        <a href="javascript:;" class="more-info" @click="goToDetail">查看详细规则</a>
                    </div>
                    <div class="content">1.邀请患者；<br>2.与新患者主动聊天；<br>3.制定随访计划；<br>4.及时回复患者。</div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="less">
    @import "../../assets/css/common";
    #app {
        .list {
            background: #fff;
            li {
                padding: 0.26rem 0.37rem 0.22rem 0.29rem;
                h3 {
                    font-size: 0.32rem;
                    color: @textColorBlack;
                    font-weight: normal;
                }
                .content {
                    font-size: 0.28rem;
                    color: @textColorBase;
                    margin-top: 0.22rem;
                }
                .flex-col {
                    display: flex;
                    justify-content: space-between;
                    .more-info {
                        font-size: 0.24rem;
                        color: @textColorLight;
                        text-align: right;
                    }
                    h3 {
                    }
                }
                border-bottom:1px solid #ececec;
            }
        }
    }
</style>
<script lang="babel">
    import util from '../../common/util';

    export default{
        data() {
            return {

            };
        },
        methods: {
            goToDetail() {
                util.changeLocation({
                    changeTo: 'pointsDetail.html',
                    timeOut: 600,
                    query: {},
                    currWin: true
                });
            }
        }
    };
</script>
