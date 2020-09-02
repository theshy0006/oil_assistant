<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
            <block slot="backText">返回</block>
            <block slot="content">
                <view class="topFont">手机号登录</view>
            </block>
        </cu-custom>
        <form>
            <view class="cu-form-group margin-top">
            	<input placeholder="请输入手机号" name="input" 
                type="number" maxlength="11" clearable v-model="phone">
                </input>
            </view>
            <view class="cu-form-group">
            	<input placeholder="请输入验证码" name="input" type="number" maxlength="6" clearable v-model="randNum">
                </input>
                <button class="cu-btn round mini-btn" 
                :class="['line-blue', 'shadow']" 
                @click="sendCode">{{sendText}}</button>
            </view>
        </form>
        <view class="padding flex flex-direction">
            <button class="cu-btn bg-blue margin-tb-sm lg shadow" style="margin-top: 100rpx;" @click="login">同意协议并登录</button>
        </view>
        <p class="protocol" @click="gotoAgreement">登录代表您同意<span>《用户服务协议》</span></p>
        
        
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
        computed: mapState(['token']),
        onLoad: function (option) {
            console.log(option.code); //打印出上个页面传递的参数。
            this.code = option.code;
        },
        onUnload: function() {
            this.clearTimer()
            this.clearLoadingTimer()
        },
		data() {
			return {
				sendText:"发送验证码",
                //用户手机号
                phone:"",
                //正在发送验证码
                isSend:false,
                //用户输入验证码
                randNum:"",
                loadModal:false,
                isLoad:false,
                time:null,
			}
		},
		methods: {
            gotoAgreement() {
                uni.navigateTo({
                    url:'../agreement/agreement'
                })
            },
            HideModal(e) {
                this.loadModal = false
            },
            LoadModal(e) {
            	this.loadModal = true;
            },
            login() {
                if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone))){
                	uni.showToast({
                		title:"请输入正确的手机号！",
                		icon:"none"
                	})
                	return  
                } 	
                if(this.randNum.length != 6){
                	uni.showToast({
                		title:"请输入正确的验证码！",
                		icon:"none"
                	})
                	return 
                } 
                this.LoadModal()
                uni.request({
                    url: this.GLOBAL.LoginWithPhone_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        code:this.code,
                    	mobile:this.phone,
                        sms_verify_code:this.randNum     //短信验证码
                    }
                }).then(data => {//data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.HideModal();
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    uni.showToast({
                    	title:response.message,
                    	icon:"none"
                    })
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
                	console.log('request fail', err);
                	uni.showModal({
                		content: err.errMsg,
                		showCancel: false
                	});
                });
                
            },
            clearTimer() {
                clearInterval(this.timer);
                this.timer = null;
            },
            clearLoadingTimer() {
                clearInterval(this.loadingTime);
                this.loadingTime = null;
            },
            countDown(){
            	var i = 60;
            	this.timer = setInterval(()=>{
            		i--
            		this.sendText = ` ${i} 秒`
            		if(i <= 0){
            			this.clearTimer()
            			this.sendText = "发送验证码"
            			this.isSend = false
            		}
            	},1000)
            },
			sendCode(){
                // 如果验证码已经发送 --return
                if(this.isSend) 
                    return;
                const user_tel = this.phone
                var that = this;
                if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(user_tel))){ 
                	uni.showToast({
                		title:"请输入正确的手机号！",
                		icon:"none"
                	})
                	return false; 
                } 

                this.LoadModal()
                uni.request({
                    url: this.GLOBAL.SendCode_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                    	mobile: this.phone,
                    }
                }).then(data => {//data为一个数组，数组第一项为错误信息，第二项为返回数据                
                    this.HideModal()
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    if( response.code == "000000" ) {
                        that.isSend = true
                        that.countDown()//倒计时
                    } else {
                        uni.showToast({
                        	title:response.message,
                        	icon:"none"
                        })  
                    }

                }).catch(err => {
                    this.HideModal()
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

<style>
    .protocol{
        color: #666666;
        margin-left: 30rpx;
        position: relative;
        top: -10px;
     }
     span{
         color: #0081FF;
     }
</style>
