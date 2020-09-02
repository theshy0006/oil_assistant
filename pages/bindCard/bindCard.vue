<template>
	<view>
        <view class="alert">
            请您绑定本人持有的副卡，若您绑定他人的副卡，我们有权取消您的奖金
        </view>
        
        <view class="cu-bar bg-white solid-bottom margit-space">
            <view class="action">
                <text class="cuIcon-title text-orange "></text> 
                绑定本人持有的中石化副卡
            </view>
        </view>
        <view class="padding bg-white bottom">
            <view class="cu-form-group">
                <view class="leftContent">10001132</view>
                <input placeholder="请输入副卡卡号后11位" 
                    name="input"
                    class="input"
                    type="number"
                    maxlength="11"
                    v-model="cardNo">
                </input>
            </view>
        </view>
            
		<view class="padding flex flex-direction bg-white bottomButton">
			<button class="cu-btn bg-blue margin-tb-sm lg shadow" @click="bindResult">提交绑定</button>
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
        computed: mapState(['token', 'phone', 'userName']),
		data() {
			return {
				loadModal:false,
                cardNo:""
			}
		},
		methods: {
            LoadModal(e) {
                this.loadModal = true;
            },
			bindResult() {
                if (this.cardNo.length!=11) {
                    uni.showToast({
                    	title:"请输入副卡卡号",
                    	icon:"none"
                    })
                    return 
                }
                this.LoadModal()
                uni.request({
                    url: this.GLOBAL.BindMinorCard_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                        access_token:this.token,
                        sub_card: "10001132"+this.cardNo, // 页码
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
                    this.loadModal = false;
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    
                    
                    if ( response.code == "000000" ) {
                        uni.navigateTo({
                            url:("./bindSuccess?bonus="+(parseFloat(response.data.prize).toFixed(2)).toString())
                        })
                    } else if ( response.code == "000004" ) {
                        uni.navigateTo({
                            url:("./bindAlert?cardNo="+"10001132"+this.cardNo)
                        })
                    } else if ( response.code == "000003" ) {
                        uni.navigateTo({
                            url:'./bindFail'
                        })
                    } else {
                        if (response.code == "000009") {
                            uni.clearStorage()
                            this.$store.commit('logout')                          
                            uni.reLaunch({
                                url:'../launchPage/launchPage'
                            });
                            setTimeout(function () {
                                uni.showToast({
                                	title:response.message,
                                    duration: 2000,
                                	icon:"none"
                                })
                            }, 1500);
                        } else {   
                            uni.showToast({
                                title:response.message,
                                duration: 2000,
                                icon:"none"
                            })
                        } 
                        
                        
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

<style lang="scss" scoped>
    .alert {
        width: 100%;
        padding-top: 8rpx;
        padding-left: 15rpx;
        padding-right: 15rpx;
        padding-bottom: 8rpx;
        background-color: rgb(254, 252, 232);
        color: #f37b1d;
    }
    .bindCard {
        background-color: #FFFFFF;
        width: 100%;
        height: 100%;
       
    }
    .margit-space {
        margin-top: 10rpx;
    }
    .leftContent {
        color: #0081ff;
        font-size: 18px;
    }
    
    .bottom {
        height: calc(100vh - 200px);
    }
    
    .bottomButton {
        position: fixed;
        bottom: 0rpx;
        width: 100%;
    }
    
    .cu-form-group {
        border-radius: 5px;
        border-color: #aaaaaa;
        border-width: thin;
        border-style:solid;
    }
    
    .input {
        padding-left: 20rpx;
        font-size: 18px;
    }
    
</style>

