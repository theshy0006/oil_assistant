<template>
	<view>
        <scroll-view scroll-y class="page">
            
            <image src="/static/back.png"
                mode="aspectFit" class="back" @click="gotoMain">
            </image> 
            
            <image src="/static/logo1.png"
                mode="aspectFit" class="runPage">
            </image> 
            <view class="padding flex flex-direction">
            	<button class="cu-btn bg-blue lg shadow" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信登录</button>
            	<button class="cu-btn margin-tb-sm lg shadow" @click="gotoPhone" style="color: #007AFF;">手机号登录</button>
            </view>
            
            <view class="flex flex-direction bottomButton">
<p class="protocol" @click="gotoAgreement">登录代表您同意<span>《用户服务协议》</span></p>
            </view>
        </scroll-view>
        
        <view class="cu-load load-customModal" v-if="loadModal">
        	<image src="/static/loading.gif" mode="aspectFit" class="gif-white response"></image>
        </view>
        
        <view class="cu-modal" :class="modalName=='alert'?'show':''">
        	<view class="cu-dialog">
        		<view class="cu-bar bg-white justify-end">
        			<view class="content">授权获取失败</view>
        			<view class="action" @tap="hideModal">
        				<text class="cuIcon-close text-red"></text>
        			</view>
        		</view>
        		<view class="padding-xl">
        			您还可以使用手机号登录
        		</view>
        		<view class="cu-bar bg-white justify-end">
        			<view class="action">
        				<button class="cu-btn line-blue text-blue" @tap="hideModal">取消</button>
        				<button class="cu-btn bg-blue margin-left" @tap="loginWithPhone">去登录</button>
        			</view>
        		</view>
        	</view>
        </view>
	</view>
</template>

<script>
export default {
    onLoad:function(option){
        this.unlogin = option.balance;
    },
    onShow() {
        uni.login({
            provider: 'weixin',
            success: (res) => {
                console.log('登录成功')
                console.log(res.code) 
                this.code = res.code
            },
            fail: (err) => {
                console.error('授权登录失败：' + JSON.stringify(err))
            }
        }); 
    },
    data() {
        return {
            code:'',
            animation:'',
            loadModal:false,
            modalName:"",
            unlogin:""
        }
    },
    methods: {
        showModal(e) {
        	this.modalName = "alert"
        },
        hideModal(e) {
        	this.modalName = null
        },
        loginWithPhone() {
            this.modalName = null
            this.gotoPhone()
        },
        LoadModal(e) {
        	this.loadModal = true;
        },
        gotoAgreement() {
            uni.navigateTo({
                url:'../agreement/agreement'
            })
        },
        gotoPhone() {
            console.log("手机号登录")
            uni.navigateTo({
                url:("./loginPage?code="+this.code)
            })
        },
        gotoMain() {
            uni.reLaunch({
                url:'../index/index'
            });
        },
        getPhoneNumber: function(e) {  
            if (e.detail.errMsg.indexOf("ok") != -1) {
                this.LoadModal()
                uni.request({
                    url: this.GLOBAL.LoginWeChat_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        code:this.code,
                    	encryptedData:e.detail.encryptedData,
                        iv:e.detail.iv
                    }
                }).then(data => {//data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);

                    if( response.code == "000000" ) {
                        console.log(response.data.access_token);
                        if (response.data.access_token != '') {
                            this.$store.commit('login', response.data.access_token);
                            uni.setStorageSync('token', response.data.access_token);
                            uni.reLaunch({
                                url:'../index/index'
                            });
                        }
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
            } else {
                uni.login({
                    provider: 'weixin',
                    success: (res) => {
                        console.log('登录成功')
                        console.log(res.code) 
                        this.code = res.code
                        this.showModal();
                    },
                    fail: (err) => {
                        console.error('授权登录失败：' + JSON.stringify(err))
                    }
                });
            }
        } 
    }
}
</script>

<style>
    @import "/colorui/animation.css";
	.page {
		height: 100vh;
        
	}
    .bottomButton {
        position: fixed;
        bottom: 30rpx;
        width: 100%;
        align-items: center;
    }
     span{
         color: #0081FF;
     }
     
     .runPage {
     	width: 360rpx;
        height: 360rpx;
        margin-top: 200rpx;
        margin-left: calc(50% - 180rpx);
        margin-bottom: 40rpx;
     }
     
     .back {
         width: 24px;
         height: 40px;
         position: fixed;
         left: 20px;
         top: 30px;
     }
     
</style>
