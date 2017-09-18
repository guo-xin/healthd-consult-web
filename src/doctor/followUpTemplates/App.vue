<template>
    <div id="app">
        <div v-show="loaded">
            <p class="title">
                随访模版

                <a class="add"  @click="addTemplate($event)">
                    <img src="../../assets/img/icon-add.png">新建模板
                </a>
            </p>

            <ul class="list">
                <li v-for="item in items">
                    <mt-cell :title="item.templateName" @click.native="add($event, item)" is-link>
                        <span class="left">
                            <img class="arrow-right" src="../../assets/img/more.png">
                        </span>
                    </mt-cell>
                </li>
            </ul>
        </div>
    </div>

</template>

<style lang="less">
    @import "../../assets/css/common.less";

    #app {
        -webkit-overflow-scrolling: touch;

        .title{
            padding: 0.2rem 0.4rem;
            font-size: @fontSizeSm;
            color: @textColorBlack;

            a{
                color: @blue;
                float: right;

                img {
                    vertical-align: -0.06rem;
                    height: 0.3rem;
                    margin-right: 0.1rem;
                }
            }
        }

        .list {
            li {
                background: @white;
                margin-top: @gap;

                &:first-child {
                    margin-top: 0;
                }
                .mint-cell-wrapper:active {
                    background-color: #FAFAFA;
                }

                .mint-cell-value.is-link{
                    margin-right: 0;
                }

                .mint-cell-allow-right{
                    display: none;
                }
            }
        }

        .mint-cell .mint-cell-text {
            word-break: break-all;
        }
    }
</style>

<script lang="babel">
    import {Indicator} from 'mint-ui';
    import util from '../../common/util';
    import doctorAuth from '../../common/doctorAuth';

    export default {
        name: 'app',
        data() {
            return {
                patientId: '',
                doctorId: '',
                loaded: false,
                items: []
            };
        },
        methods: {
            addTemplate(event) { //eslint-disable-line no-unused-vars
                util.changeLocation({
                    changeTo: 'addFollowUpPlanTemplate.html',
                    query: {
                        patientId: this.patientId,
                        doctorId: this.doctorId,
                        patientName: util.getParams('patientName'),
                        device: util.getParams('device'),
                        chronicdDoctorId: this.doctorId
                    },
                    timeOut: 100,
                    currWin: true
                });
            },

            add(event, item) {
                util.changeLocation({
                    changeTo: 'addFollowUpPlan.html',
                    query: {
                        templateId: item.id,
                        patientId: this.patientId,
                        doctorId: this.doctorId,
                        patientName: util.getParams('patientName'),
                        device: util.getParams('device'),
                        chronicdDoctorId: this.doctorId,
                        own: !!item.chronicdDoctorId
                    },
                    timeOut: 100,
                    currWin: true
                });
            },

            getSystemTemplates() {
                Indicator.open();

                this.$http.get('/baseApi/doctor-follow-up/template-library-list').then(
                    (response) => {
                        let res = response.data;

                        if (res.result === 0) {
                            this.loaded = true;

                            let results = res.data.results;
                            this.appendSystemTemplates(results);
                        }

                        Indicator.close();
                    },
                    (response) => { //eslint-disable-line no-unused-vars
                        Indicator.close();
                    }
                );
            },

            appendSystemTemplates(list) {
                let items = [];
                let item;

                for (let i = 0; i < list.length; i++) {
                    item = list[i];

                    items.push(item);
                }

                this.items = items.concat(this.items);
            },

            getOwnTemplates() {
                Indicator.open();

                this.$http.get('/baseApi/doctor-follow-up/chronicd-doctor-template-list', {
                    params: {
                        chronicdDoctorId: this.doctorId
                    }
                }).then(
                    (response) => {
                        let res = response.data;

                        if (res.result === 0) {
                            this.loaded = true;

                            let results = res.data.results;
                            this.appendOwnTemplates(results);
                        }
                        Indicator.close();
                    },
                    (response) => { //eslint-disable-line no-unused-vars
                        Indicator.close();
                    }
                );
            },

            appendOwnTemplates(list) {
                let items = [];
                let item;

                for (let i = 0; i < list.length; i++) {
                    item = list[i];

                    items.push(item);
                }

                this.items = this.items.concat(items);
            }

        },

        mounted() {
            this.patientId = util.getParams('patientId');
            this.doctorId = doctorAuth.getDoctorId();
            this.getSystemTemplates();
            this.getOwnTemplates();
        }
    };
</script>
