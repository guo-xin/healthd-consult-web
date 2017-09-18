<template>
    <div id="app">
        <div class="section">
            <ul class="list">
                <li>
                    <h3>Q1 : 邀患者 领积分</h3>
                    <div class="content">患者向医生扫码，扫码成功，获得5积分。单击“去邀请”进入我的二维码页面。</div>
                </li>
                <li>
                    <h3>Q2 : 邀聊天  领积分</h3>
                    <div class="content">医生向一个没有沟通过的患者主动发一条消息，获得5积分。（患者扫码成功后，系统自动发送的消息不算已经沟通过）</div>
                </li>
                <li>
                    <h3>Q3 : 制定随访计划，领积分</h3>
                    <div class="content">医生向一个患者发送一个随访计划。获得10积分。（医生医生向同一个患者发送超过一份随访计划，只有第一份计划获取积分其他随访计划不获取积分。）</div>
                </li>
                <li>
                    <h3>Q4 : 制定随访计划，领积分</h3>
                    <div class="content">医生回复患者时，如果医生在十分钟内回复患者，每条信息获得1积分。</div>
                </li>
            </ul>
            <div class="list-tip">积分最终解释权，归“上海览海在线健康管理有限公司”</div>
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
                    margin-top: 0.3rem;
                }
                border-bottom:1px solid #ececec;
            }
        }
        .list-tip {
            padding: 0.22rem 0 0 0.29rem;
            font-size: 0.24px;
            color: @textColorLight;
            text-align:left;
        }
    }
</style>
<script lang="babel">
    export default {
        data() {
            return {

            };
        }
    };
</script>
