<template>
    <div id="app">
        <div class="field">
            <div class="part" @click="edit('editInformation')">
                <div class="left">
                    <img src="../../assets/img/archives-infor.png">
                </div>
                <div class="infor" v-text="'基本信息'">
                </div>
                <div class="complete" v-if="item.baseInfo!=1" v-text="'请完善'"></div>
                <div class="right">
                    <img src="../../assets/img/more.png">
                </div>
            </div>

            <div class="part" @click="edit('editPersonalHistory')">
                <div class="left">
                    <img src="../../assets/img/archives-person.png">
                </div>
                <div class="infor" v-text="'个人病史'">
                </div>
                <div class="complete" v-if="item.selfDiseases!=1" v-text="'请完善'"></div>
                <div class="right">
                    <img src="../../assets/img/more.png">
                </div>
            </div>

            <!--<div class="part" @click="edit('editPersonalHistory')">
                <div class="left">
                    <img src="../../assets/img/archives-life.png">
                </div>
                <div class="infor" v-text="'生活习惯'">
                </div>
                <div class="complete" v-if="!item.baseInfo" v-text="'请完善'"></div>
                <div class="right">
                    <img src="../../assets/img/more.png">
                </div>
            </div>-->

            <div class="part" @click="edit('editFamilyHistory')">
                <div class="left">
                    <img src="../../assets/img/archives-family.png">
                </div>
                <div class="infor" v-text="'家族病史'">
                </div>
                <div class="complete" v-if="item.familyDiseases!=1" v-text="'请完善'"></div>
                <div class="right">
                    <img src="../../assets/img/more.png">
                </div>
            </div>

            <div class="part" @click="edit('checkTreatList')">
                <div class="left">
                    <img src="../../assets/img/archives-treat.png">
                </div>
                <div class="infor" v-text="'诊疗记录'">
                </div>
                <div class="complete" v-if="item.medicalRecord!=1" v-text="'请完善'"></div>
                <div class="right">
                    <img src="../../assets/img/more.png">
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="babel">
import { Indicator} from 'mint-ui';
import userAuth from '../../common/userAuth';
import util from '../../common/util';

export default {
    name: 'app',
    data() {
        return {
            item: {
                baseInfo: 1,
                selfDiseases: 1,
                familyDiseases: 1,
                medicalRecord: 1
            }
        };
    },
    methods: {
        //基本信息
        edit: function (val) {
            util.changeLocation({
                changeTo: val + '.html',
                timeOut: 600
            });
        },

        //获取数据请求
        getData() {
            Indicator.open();
            let chronicdUserId = userAuth.getUserInfo('id');
            //http://192.168.2.201:8081/chronicd-server-api/v1/health-record/index?chronicdUserId=10000011
            this.$http.get('/baseApi/health-record/index', {
                params: {
                    chronicdUserId: chronicdUserId
                }
            }).then(
                (response) => {
                    Indicator.close();

                    let res = response.data;
                    if (res.result === 0) {
                        this.item = res.data;
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
                    Indicator.close();
                }
            );
        }
    },

    mounted() {
        this.getData();
    }
};
</script>

<style lang="less">
    @import "../../assets/css/common.less";

    #app {

        .field {
            background: @white;

            .part {
                display: flex;
                align-items: center;
                padding: 0.32rem 0.4rem 0.32rem 0;
                margin-left: 0.4rem;
                border-top: 1px solid @borderColor;

                &:first-child{
                    border-top: 0;
                }

                &:hover, &:active {
                    background: @bgHoverColor;
                }

                & > div {
                    margin: 0 0.1rem;
                }
                .left {
                    width: 0.4rem;
                    img {
                        width: 0.4rem;
                        height: 0.4rem;
                        vertical-align: middle;
                    }
                }
                .infor {
                    flex: 1;
                    color: @textColorBlack;
                    font-size: @fontSizeBase;
                }
                .complete {
                    width: 0.8rem;
                    color: @textColorBlue;
                    font-size: @fontSizeXs;
                }
                .right {
                    width: 0.2rem;
                    img {
                        width: 0.2rem;
                        vertical-align: middle;
                    }
                }
            }

        }

    }

    #app {
        .field {
            .part {
                padding: 0.32rem 0.4rem 0.32rem 0;
                margin-left: 0.4rem;
                .left {
                    width: 0.4rem;
                    img {
                        width: 0.4rem;
                        height: 0.4rem;
                    }
                }
                & > div {
                    margin: 0 0.1rem;
                }
                .right {
                    width: 0.2rem;
                    img {
                        height: 0.23rem;
                    }
                }
            }
        }
    }
</style>
