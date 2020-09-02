<template>
	<view>
        <view class="alert">
            为保证提现成功，请务必填写正确的银行信息，开户银行需填写到支行名称（XX银行XX支行）
        </view>
        
        <form>
        	<view class="cu-form-group margin-top">
        		<view class="title">收款人姓名</view>
        		<input placeholder="请输入收款人姓名" name="input" 
                type="text" clearable v-model="userName" 
                style="text-align:right">
                </input>
        	</view>
        	<view class="cu-form-group">
        		<view class="title">银行账号</view>
        		<input placeholder="请输入收款人银行账号" name="input" 
                type="number" 
                clearable v-model="cardNo"
                style="text-align:right">
                </input>
        	</view>
        	<view class="cu-form-group">
        		<view class="title">开户银行</view>
        		<input placeholder="请输入开户银行及支行名称" 
                name="input" 
                clearable v-model="bank"
                style="text-align:right">
                </input>
        	</view>
        </form>
        
        <form>
            <view class="cu-form-group align-start margin-top">
            	<view class="title withdraw">提现金额</view>
            </view>
            <view class="money">
                <view class="title moneyIcon" style="margin-left: 30rpx;">￥</view>
                <input placeholder="请输入提现金额" name="input"
                type="number" 
                clearable v-model="pullMoney"
                style="
                 text-align:left">
                </input>
            </view>
            <view class="cu-form-group">
            	<view class="title bottomAlert">奖金余额{{balance}}元</view>
            </view>
        </form>
        
        <view class="padding flex flex-direction bottomButton">
        	<button class="cu-btn bg-blue margin-tb-sm lg shadow" @click="bindResult">确认提取</button>
        </view>
        
        <!-- loading框控件 -->
        <view class="cu-load load-customModal" v-if="loadModal">
            <image src="/static/loading.gif" mode="aspectFit" class="gif-white response">
            </image>
        </view>
        
        
	</view>
</template>

<script>
    import Vue from 'vue'
    import {
    	mapState
    } from 'vuex'
	export default {
        computed: mapState(['token', 'phone']),
        onLoad: function (option) {
            this.balance = option.balance;
            if(typeof(this.balance) == "undefined"){
                this.balance = "0.00"
            }
            
            this.initData();
        },
		data() {
			return {
				userName:"",
                bank:"",
                cardNo:"",
                balance:"",
                pullMoney:"",
                balance:"0.00",
                loadModal:false,
			};
		},
        methods: {
            bindResult() {
                if (this.userName.length == 0) {
                    uni.showToast({
                    	title:"请输入姓名",
                    	icon:"none"
                    })
                    return
                }
                
                if (this.bank.length == 0) {
                    uni.showToast({
                    	title:"请输入银行名称",
                    	icon:"none"
                    })
                    return
                }
                
                if (this.cardNo.length == 0) {
                    uni.showToast({
                    	title:"请输入银行卡号",
                    	icon:"none"
                    })
                    return
                }
                
                if(parseFloat(this.pullMoney)<0.01 || this.pullMoney.length == "") {
                    uni.showToast({
                    	title:"请输入提现金额",
                    	icon:"none"
                    })
                    return
                }
                if(parseFloat(this.pullMoney) > 
                    parseFloat(this.balance)) {
                    uni.showToast({
                    	title:"奖金余额不足",
                    	icon:"none"
                    })
                    return
                }
                
                this.LoadModal()
                var that = this;
                uni.request({
                    url: this.GLOBAL.RequestWithdraw_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        access_token:this.token,
                        payee: this.userName, // 收款人姓名
                        bank_account: this.cardNo, //银行卡号
                        bank_detail:this.bank, //开户行名称
                        cash:this.pullMoney, //提取金额
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    that.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    uni.showToast({
                        title:response.message,
                        icon:"none"
                    });
                    if( response.code == "000000" ) {
                        uni.navigateBack({
                            delta:1
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
            },
            LoadModal(e) {
                this.loadModal = true;
            },
            initData() {
                this.LoadModal()
                var that = this;
                uni.request({
                    url: this.GLOBAL.GetSuccessGetCashBank_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        access_token:this.token,
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    that.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    if( response.code == "000000" ) {
                        that.userName = response.data.payee
                        that.cardNo = response.data.bank_account
                        that.bank = response.data.bank_detail
                    } else {

                        if (response.code == "000009") {
                            uni.clearStorage()
                            this.$store.commit('logout')                          
                            uni.reLaunch({
                                url:'../launchPage/launchPage'
                            });
                        } 
                         
                        setTimeout(function () {
                            uni.showToast({
                            	title:response.message,
                                duration: 2000,
                            	icon:"none"
                            })
                        }, 1500);
                    }
                }).catch(err => {
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
    .alert {
        width: 100%;
        padding-top: 8rpx;
        padding-left: 15rpx;
        padding-right: 15rpx;
        padding-bottom: 8rpx;
        background-color: rgb(254, 252, 232);
        color: #f37b1d;
    }
    .money {
        display: flex;
        background-color: #FFFFFF;
        font-size: 40rpx;
        border-bottom: 1upx solid #eee;
        padding-bottom: 10rpx;
        display: flex;
        align-items: center;
    }
    .moneyIcon {
        font-size: 40rpx;
    }
    
    .withdraw {
        font-size: 36rpx;
    }
    
    .bottomAlert {
        font-size: 26rpx;
        color: #999999;
    }
    .bottomButton {
        position: fixed;
        bottom: 0rpx;
        width: 100%;
    }
</style>
