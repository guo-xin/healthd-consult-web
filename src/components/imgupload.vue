<template>
    <div class='bottom'>
        <span v-for="(item,index) in files" track-by="$index">
            <img :src="item+'?x-oss-process=image/resize,m_fixed,h_80,w_80'"/>
            <span @click="delimage(index)" class="delete">
                <img src="../assets/img/delete.png">
            </span>
        </span>
        <span class="addPicture" v-if='files.length<16'>
            <img src="../assets/img/add-picture.png">
            <input type="file" class="upload-input" accept="jpg,jpeg,png,gif;capture=camera"
                   @change="chooseFile">
        </span>


    </div>
</template>
<script lang="babel">

import {Toast,Indicator} from 'mint-ui';
import http from '../common/http.js';
import Vue from 'vue'; //eslint-disable-line no-unused-vars
var api =
    {
        //上传图片
        upload: function (params) {
            var url = '/baseApi/upload/part-file';
            return http.post(url, params, {
                headers: {
                    enctype: 'multipart/form-data'
                }
            });
        },
        //删除上传文件
        deleteupload: function () {
            //this.$emit('confirm', this.files);
        }
    };
export default {
    props: ['files','maxlength'],//上传的文件双向绑定

    data() {
        return {
            file: {
                currentfile: ''//当前要上传的文件
            }
        };
    },

    methods: {
        handleUploadSuccess(info) {
            this.files.push(info.url);
            //this.$emit('confirm', this.files);
        },
        chooseFile(event) {
            const {files} = event.target;
            if (files.length > 0) {
                let file0type = files[0].type;
                let file0size = files[0].size;
                if (!file0type) {
                    this.showtip('不能上传非图片');
                    //清空
                    this.file.currentfile = '';
                    return;
                }
                if (!(/.\/(jpg|jpeg|png|gif)/ig.test(file0type))) {
                    this.showtip('不能上传非图片');
                    //清空
                    this.file.currentfile = '';
                    return;
                }
                if (file0size > 10 * 1024 * 1024) {
                    this.showtip('图片太大了');
                    //清空
                    this.file.currentfile = '';
                    return;
                }
                Indicator.open();
                let oMyForm = new FormData();
                oMyForm.append('file', files[0]);
                this.file.currentfile = '';
                api.upload(oMyForm).then(
                    (res) => {
                        Indicator.close();
                        let resdata = res.data;
                        if (resdata.result == 0) {
                            this.handleUploadSuccess(resdata.data);
                        } else {
                            this.showtip('图片太大了，请重新拍摄');
                        }
                    }, (res) => { //eslint-disable-line no-unused-vars
                        // error callback
                    Indicator.close();
                    this.showtip('网络不太稳定，请稍后再试');
                });
            }
        },
        showtip(info) {
            Toast(info);
        },
        delimage(index) {
            this.files.splice(index,1);
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

    .bottom {
        padding-top: 0;
        overflow: hidden;
        & > span {
            width: 25%;
            padding: 4px 8px 4px 0;
            display: inline-block;
            float: left;
            text-align: left;
            height: 80px;
            position: relative;
        }

        .delete {
            position: absolute;
            right: 14px;
            top: 6px;
            width: 20px;
            height: 20px;
        }

        .addPicture {
            position: relative;

        }
        img {
            height: 100%;
        }

    }

    .upload-input {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
</style>
