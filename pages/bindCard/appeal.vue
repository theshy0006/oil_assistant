<template>
	<view>
        <form>
        	<view class="cu-form-group margin-top">
        		<view class="title">副卡卡号</view>
        		<input placeholder="请输入副卡卡号" name="input" 
                type="number" v-model="cardNo" disabled = 'true' style="text-align:right">
                </input>
        	</view>
        	<view class="cu-form-group">
        		<view class="title">手机号</view>
        		<input placeholder="请输入手机号" name="input" 
                type="number" v-model="phone" disabled = 'true' style="text-align:right">
                </input>
        	</view>
        	<view class="cu-form-group">
        		<view class="title">姓名</view>
        		<input placeholder="请输入您的姓名" 
                name="input" style="text-align:right" v-model="driverName">
                </input>
        	</view>
            <view class="cu-form-group align-start">
				<view class="title">申诉理由</view>
				<textarea maxlength="50" v-model="reason"
                 placeholder="请简单描述您的持卡情况，例如持卡时间、主卡持有人">
                </textarea>
			</view>
            <view class="cu-bar bg-white margin-top">
            	<view class="action">
            		图片上传
            	</view>
            	<view class="action">
            		{{imgList.length}}/3
            	</view>
            </view>
            <view class="cu-form-group">
            	<view class="grid col-4 grid-square flex-sub">
            		<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
            		 <image :src="imgList[index]" mode="aspectFill"></image>
            			<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
            				<text class='cuIcon-close'></text>
            			</view>
            		</view>
            		<view class="solids" @tap="ChooseImage" v-if="imgList.length<3">
            			<text class='cuIcon-cameraadd'></text>
            		</view>
            	</view>
            </view>
            <view class="redAlert">为了更好的核实持卡人，请您上传本人手持副卡的照片</view>
        </form>
        <view class="padding flex flex-direction bottomButton">
        	<button class="cu-btn bg-blue margin-tb-sm lg shadow" @click="upload">确认提交</button>
        </view>
        
        <view class="cu-load load-customModal" v-if="loadModal">
        	<image src="/static/loading.gif" mode="aspectFit" class="gif-white response"></image>
        </view>
        
	</view>
</template>

<script>
    import Vue from 'vue'
    import {
    	mapState
    } from 'vuex'
	export default {
        computed: mapState(['token', 'phone', 'name']),
		data() {
			return {
				imgList: [],
                cardNo:"",
                reason:'',
                driverName:'',
                loadModal:false,
                urlArray: []
			};
		},
        onLoad: function (option) {
            console.log(option.cardNo); //打印出上个页面传递的参数。
            console.log(this.phone)
            this.cardNo = option.cardNo
            this.driverName = this.name;
        },
        methods: {
            LoadModal(e) {
                this.loadModal = true;
            },
            ChooseImage() {
                var that = this
            	uni.chooseImage({
            		count: 1, //默认9
            		sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
            		sourceType: ['album','camera'], //从相册选择
            		success: (res) => {
            			if (that.imgList.length != 0) {
                            if ((that.imgList.length + res.tempFilePaths.length) <= 3) {
                              that.imgList = that.imgList.concat(res.tempFilePaths)
                            } else {
                                uni.showToast({
                                    title:'最多只能上传3张图片',
                                    icon:'none'
                                })
                            }
            			} else {
            				that.imgList = res.tempFilePaths
            			}
                        that.uploadImage(res.tempFilePaths)
            		}
            	});
            },
            ViewImage(e) {
            	uni.previewImage({
            		urls: this.imgList,
            		current: e.currentTarget.dataset.url
            	});
            },
            
            uploadImage(array) {
                this.LoadModal()
                uni.uploadFile({
                    url: this.GLOBAL.UploadImage_URL, //仅为示例，非真实的接口地址
                    name:'file',
                    filePath:array[0],
                    formData: {
                        'file': 'file',
                        'user': 'test'
                    },
                    success: (uploadFileRes) => {
                        this.loadModal = false;
                        console.log(uploadFileRes.data);
                        let response = JSON.parse(uploadFileRes.data);
                        if (response.code == "000000") {
                            if (this.urlArray.length < 3) {
                                this.urlArray.push(response.data)
                            }
                        } else {
                            uni.showToast({
                            	title:response.message,
                            	icon:"none"
                            }) 
                        }
                    },
                    fail: (err) => {  
                        this.loadModal = false
                            console.log(err)  
                        },  
                        complete: (complete) => {  
                            console.log(complete)   
                        }  
                });
            },
            
            DelImg(e) {
            	uni.showModal({
            		content: '确定要删除这张照片吗？',
            		cancelText: '取消',
            		confirmText: '确定',
            		success: res => {
            			if (res.confirm) {
            				this.imgList.splice(e.currentTarget.dataset.index, 1)
                            this.urlArray.splice(e.currentTarget.dataset.index, 1)
            			}
            		}
            	})
            },
            
            upload() {
                if( this.driverName.length == 0 ) {
                    uni.showToast({
                        title:"请输入姓名",
                        icon:'none'
                    })
                    return
                }
                
                if (this.reason.length == 0 ) {
                    uni.showToast({
                        title:"请输入申诉理由",
                        icon:'none'
                    })
                    return
                }
                
                if (this.imgList.length == 0) {
                    uni.showToast({
                        title:"请上传图片",
                        icon:'none'
                    })
                    return
                }
                var url = [];
                url = url.concat(this.urlArray)
                while(url.length < 3) {
                    url.push('')
                }
                this.LoadModal()
                uni.request({
                    url: this.GLOBAL.CommitAppeal_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        access_token:this.token,
                        sub_card: this.cardNo, // 页码
                        phone:this.phone,
                        name:this.driverName,
                        reason:this.reason,
                        pic1_url:url[0],
                        pic2_url:url[1],
                        pic3_url:url[2]
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);

                    if ( response.code == "000000" ) {
                        uni.showModal({
                            title: '提交成功',
                            showCancel: false,
                        	content: '请您确保电话畅通，我们将尽快核实并与您联系',
                        	confirmText: '知道了',
                        	success: res => {
                                uni.navigateBack({
                                    delta: 3
                                });
                        	}
                        })
                    } else {
                        uni.showToast({
                        	title:response.message,
                        	icon:"none"
                        }) 
                    }
                }).catch(err => {
                    this.loadModal = false;
                	console.log('request fail', err);
                	uni.showModal({
                		content: err.errMsg,
                		showCancel: false
                	});
                }); 
            }
        }
	}
</script>

<style lang="scss">
    .redAlert {
        background-color: #FFFFFF;
        color: #e54d42;
        font-size: 24rpx;
        padding-left: 24rpx;
    }
    .bottomButton {
        position: fixed;
        bottom: 0rpx;
        width: 100%;
    }
</style>
