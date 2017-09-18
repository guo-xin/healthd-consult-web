<template>
    <div id="app">
        <section>
            <div class="title">
                <div class="logo">
                    <img src="../../assets/img/logo.png" >
                </div>
                <div class="detail">
                    <div class="name">览海健康 <span>（医生版）</span></div>
                    <div class="en-name">My Dy.</div>
                    <div class="url">www.healthdoc.cn</div>
                </div>
            </div>
            <div class="current-version">
                <div class="label">当前版本</div>
                <div class="value" v-text="version">V2.0.0</div>
            </div>
            <div class="phone" :style="{display: 'none'}">
                <div class="label">联系方式</div>
                <div class="value">010-888888</div>
            </div>
            <div class="introduce">
                览海健康是上海览海在线健康管理有限公司推出的一款移动医疗服务软件。软件致力于通过视频咨询或电话咨询的全新医疗方式，为用户提供在线问诊、健康档案、慢病管理等家庭级医疗健康服务。有了览海健康，从此小病不用去医院。
            </div>
        </section>
        <div class="foot">©{{new Date().getFullYear()}} healthdoc.cn</div>
    </div>
</template>
<style lang="less">
    @import "../../assets/css/common";
    #app {
        padding: 0;
        display: flex;
        min-height: 100%;
        flex-direction: column;
        .title {
            display: flex;
            justify-content: flex-start;
            padding: 0.61rem 0 0.61rem 0.29rem;
            border-bottom: 1px solid #ececec;
            .logo {
                width: 1.4rem;
                height: 1.4rem;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .detail {
                margin-left: 0.22rem;
                .name {
                    font-size: 0.36rem;
                    color: #3abde6;
                    span {
                        font-size: 0.24rem;
                        color: @textColorBase;
                    }
                }
                .en-name {
                    margin-top: 0.11rem;
                    font-size: 0.24rem;
                    color: #3abde6;
                }
                .url {
                    margin-top: 0.2rem;
                    font-size: 0.24rem;
                    color: #939393;
                }
            }
        }
        .current-version, .phone {
            display: flex;
            justify-content: space-between;
            padding: 0 0.28rem;
            height: 1rem;
            line-height: 1rem;
            border-bottom: 1px solid #ececec;
            .label {
                font-size: 0.3rem;
                color: @textColorBlack;
            }
            .value {
                font-size: 0.3rem;
                color: @textColorBase;
            }
        }
        .introduce {
            font-size: 0.28rem;
            color: @textColorBase;
            text-indent: 2em;
            padding: 0.36rem 0.34rem 2.8rem 0.42rem;
        }
        section {
            background-color: #fff;
            flex: 1;
        }
        .foot {
            font-size: 0.24rem;
            width: 100%;
            color: @textColorLight;
            text-align: center;
            background: #f7f7f9;
            border: none;
        }
    }
</style>
<script lang="babel">
    import util from '../../common/util';

    export default{
        name: 'app',
        data() {
            return {
                version: ''
            };
        },
        methods: {
            getVersion() {
                this.version = util.getParams('version');
            }
        },
        mounted() {
            this.getVersion();
        }
    };
</script>
