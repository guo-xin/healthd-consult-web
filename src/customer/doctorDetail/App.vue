<template>
    <div id="app" class="foot-fixed">
        <div v-show="isShow">
            <div class="basis">
                <div class="left">
                    <span class="circle border">
                        <img :src="item.headPic || defaultHead">
                    </span>
                </div>
                <div class="right">
                    <p class="name" v-text="item.realName"></p>

                    <p class="title">
                        <span v-text="item.department"></span><span> {{item.jobTitle ? "|" : ""}} </span><span
                            v-text="item.jobTitle"></span>
                    </p>

                    <p class="hospital" v-text="item.hospitalName"></p>
                </div>
            </div>

            <div class="consult" @click="consult" v-for="product in products">
                <span class="left">
                    <span class="circle">
                        <img src="../../assets/img/consult-chat.png">
                    </span>
                </span>

                <span class="right">
                    <p class="title">
                        <span class="name" v-text="product.productName"></span>
                        <span class="price" v-text="product.payment"></span>
                    </p>
                    <p class="content" v-text="product.description"></p>
                </span>
            </div>

            <div class="profile">
                <div class="paragraph">
                    <div class="speciality">
                        <span class="text">擅长：</span><span v-text="item.specialSkill"></span>
                    </div>
                    <div class="introduce">
                        <span class="text">介绍：</span><span v-text="item.introduction"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    @import "../../assets/css/common";

    #app {
        font-size: @fontSizeBase;
        padding-top: 0;
        position: static;
    }

    .mint-button.is-disabled {
        img {
            opacity: 0.3;
        }
    }

    .basis {
        padding: 0.4rem 0.6rem 0.4rem 0;
        background: url('../../assets/img/doctor-bg.png') no-repeat;
        background-size: cover;
        margin-bottom: 0.19rem;

        .circle {
            width: 1.36rem;
            height: 1.36rem;
            border: none;
        }

        .left {
            float: left;
            width: 2.1rem;
            text-align: center;
            align-self: baseline;
        }

        .right {
            min-height: 1.3rem;
            margin-left: 2.1rem;

            p {
                margin: 0.07rem 0;
            }
        }

        .name {
            font-size: @fontSizeBase;
            color: @textColorBlack;
            margin-bottom: 0.23rem;
        }

        .title {
            font-size: @fontSizeXs;
            color: @textColorBase;
            margin-bottom: 0.14rem;
        }

        .hospital {
            font-size: @fontSizeXs;
            color: @textColorBase;
        }
    }

    .profile {
        background: #fff;
        font-size: @fontSizeSm;
        color: @textColorBase;
        padding: 0.35rem 0.3rem 0.35rem 0.4rem;
        .paragraph {
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
        padding: 0.4rem 0.29rem 0.47rem 0;
        background: #fff;
        margin-bottom: 0.19rem;
        .circle {
            width: 0.8rem;
            height: 0.8rem;
            background: @textColorBlue;
            border-radius: 100%;
        }

        .left {
            display: block;
            width: 1.41rem;
            text-align: center;
            align-self: flex-start;
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
                margin-bottom: 0.18rem;
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
                font-size: 0.24rem;
                color: @textColorLight;
                line-height: 0.26rem;
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
    import { Indicator } from 'mint-ui';
    import util from '../../common/util';
    import userAuth from '../../common/userAuth';

    export default {
        name: 'app',
        data() {
            return {
                defaultHead: require('../../assets/img/head-doctor.png'), //eslint-disable-line no-undef
                productId: null,
                item: {},
                products: {},
                isShow: false
            };
        },
        methods: {
            paymentForm() {
                for (let i = 0; i < this.products.length; i++) {
                    if (this.products[i].serviceType === 0) {
                        this.products[i].payment = '免费';
                    } else {
                        if (this.products[i].messageCount) {
                            this.products[i].payment = this.products[i].price + '元' + '/' + this.products[i].messageCount + '条';
                        } else {
                            this.products[i].payment = this.products[i].price + '元' + '/' + this.products[i].timeLimit + '分钟';
                        }
                    }
                }
            },

            consult() {
                if (userAuth.getUserInfo('isComplete') != 1) {
                    util.changeLocation({
                        changeTo: 'addBasicInfo.html',
                        timeOut: 600,
                        query: {
                            chronicdDoctorId: this.item.chronicdDoctorId,
                            historyPage: 'doctorDetail.html'
                        }
                    });
                } else {
                    if (this.item.consultConversationId) {
                        util.changeLocation({
                            changeTo: 'im/index.html',
                            timeOut: 600,
                            query: {
                                consultConversationId: this.item.consultConversationId,
                                roleCode: 1
                            }
                        });
                    } else {
                        util.changeLocation({
                            changeTo: 'doctorDescribe.html',
                            timeOut: 600,
                            query: {
                                chronicdDoctorId: util.getParams('chronicdDoctorId'),
                                productId: this.productId || '',
                                patientId: userAuth.getUserInfo('patientId'),
                                doctorId: this.item.doctorId
                            }
                        });
                    }
                }
            },

            getProductId() {
                Indicator.open();
                this.$http.get('/baseApi/products').then(
                        (response) => {
                            Indicator.close();

                            let res = response.data;
                            if (res.result === 0) {
                                this.productId = res.data[0].productId || {};
                                this.products = res.data || {};
                                this.paymentForm();
                                this.isShow = true;
                            } else {
                                util.showMessage({
                                    type: 'loadFai',
                                    duration: 1000
                                });
                                this.isShow = true;
                            }
                        },
                        () => {
                            util.showMessage({
                                type: 'loadFai',
                                duration: 1000
                            });
                            Indicator.close();
                            this.isShow = true;
                        }
                );
            },

            getData() {
                Indicator.open();

                let chronicdDoctorId = util.getParams('chronicdDoctorId');
                let chronicdUserId = userAuth.getUserInfo('id');
                let patientId = userAuth.getUserInfo('patientId');

                this.$http.get('/baseApi/doctor/services/details', {
                    params: {
                        chronicdDoctorId: chronicdDoctorId,
                        chronicdUserId: chronicdUserId,
                        patientId: patientId
                    }
                }).then(
                        (response)=> {
                            Indicator.close();

                            let res = response.data;
                            if (res.result === 0) {
                                this.item = res.data || {};

                                util.setTitle(`${this.item.realName || '医生'}的主页`);
                            } else {
                                util.showMessage({
                                    type: 'loadFai',
                                    duration: 1000
                                });
                            }
                        },

                        (response)=> { //eslint-disable-line no-unused-vars
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
            this.getProductId();
        }
    };
</script>
