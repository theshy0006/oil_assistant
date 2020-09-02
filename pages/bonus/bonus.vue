<template>
	<view>
        <view class="top">
            <view class="topLeft">
                <image src="../../static/balanceIcon.png" class="img">
                <p>￥{{balance}}</p>
            </view>
            <view class="topRight">
                <button class="cu-btn" :class="['bg-white', 'shadow']" @click="gotoRequest" style="font-size: 30rpx;">
                    申请提现
                </button>
            </view>
        </view>
        <view class="bottom">
            <view class="bottomLeft">
                
            </view>
            <view class="bottomCenter">
                奖金收支明细
            </view>
            <view class="bottomLeft">
                <button class="cu-btn sm" 
                    :class="['bg-blue', 'shadow']" 
                    style="color: #FFFFFF;" @tap="showModal" data-target="RadioModal">
                    {{candidates[type]}}
                </button>
                <image class="rightArrow" @tap="showModal" data-target="RadioModal"
                    src = "../../static/buttonDown.png">
                </image>
                
            </view>
            
        </view>
        
        <view v-if="data.length==0" class="empty">
            <image src="/static/empty.png" class="emptyImg"></image>
            <view class="emptyLabel">
                空空如也<br>
            </view>
        </view>

        <!-- 退出登录弹框 -->
        <view class="cu-modal bottom-modal" 
        :class="modalName=='bottomModal'?'show':''">
        	<view class="logout">
                <view class="padding-xs">
                    <view class="itemBarALL bg-white">
                        <view class="itemcontent text-blue" @click="allPressed">全部</view>
                    </view>
                    <view class="line-h"></view>
                    <view class="itemBarSend bg-white">
                        <view class="itemcontent text-blue" @click="sendPressed">奖励发放</view>
                    </view>
                    <view class="line-h"></view>
                    <view class="itemBarReceive bg-white">
                        <view class="itemcontent text-blue" @click="receivePressed">奖金提现</view>
                    </view>
                </view>

        		<view class="padding-xs" style="font-size: 40rpx;">
        			<view class="itemBar bg-white">
        			    <view class="itemcontent text-blue" @click="hideModal">取消</view>
        			</view>
        		</view>
        	</view>
        </view>



        <view class="bottombottom">
            <view v-for="(item1,index1) in data" :key="index1" >
                <media-item :options="item1">
                </media-item>
            </view>
            <view class="uni-loadmore" v-if="showLoadMore">
                {{loadMoreText}}
            </view>
        </view>
        
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
    import mediaItem from '../index/expense-item.vue';
	export default {
        computed: mapState(['token', 'phone', 'userName']),
        components: {
            mediaItem
        },
		data() {
			return {
				data: [],
				loadMoreText: "加载中...",
				showLoadMore: false,
				max: 0,
				CustomBar: this.CustomBar,
                balance:"0.00",
                candidates: ['全部', '奖励发放', '奖金提现'],
                modalName: "",
                type: 0,
                pageNo: 1,
                loadModal:false
			}
		},
		methods: {
            LoadModal(e) {
                this.loadModal = true;
            },
            showModal(e) {
                this.modalName = "bottomModal"  
            },
            allPressed() {
                this.type = 0;
                this.pageNo = 1
                this.loadMoreText= "加载中..."
                this.showLoadMore= false
                this.hideModal();
                this.initData();
            },
            receivePressed() {
                this.type = 2;
                this.pageNo = 1;
                this.loadMoreText= "加载中..."
                this.showLoadMore= false
                this.hideModal();
                this.initData();
            },
            sendPressed() {
                this.type = 1;
                this.pageNo = 1;
                this.loadMoreText= "加载中..."
                this.showLoadMore= false
                this.hideModal();
                this.initData();
            },
            hideModal(e) {
            	this.modalName = null
            },
            getUserInfo() {
                var that = this;
                uni.request({
                    url: this.GLOBAL.GetUserInfo_URL,
                    dataType: 'jsonp',
                    method: 'POST',
                    data: {
                    	access_token:this.token,
                    }
                }).then(data => {
                    //data为一个数组，数组第一项为错误信息，第二项为返回数据
               
                    var [error, res]  = data;
                    console.log(res.data);
                    let response = JSON.parse(res.data);
                    if( response.code == "000000" ) {
                        if (response.data.phone != '') {
                            that.balance = (parseFloat(response.data.prize_remain).toFixed(2)).toString();
                        }
                        that.initData();
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
                            that.initData();
                        } 
                        
                    }
                    
                }).catch(err => {
                	console.log('request fail', err);
                	uni.showModal({
                		content: err.errMsg,
                		showCancel: false
                	});
                    that.initData();
                });
            },
            
			initData(){
				this.LoadModal()
                var that = this;
				uni.request({
				    url: this.GLOBAL.GetBonusList_URL,
				    dataType: 'jsonp',
				    method: 'POST',
				    data: {
                        access_token:this.token,
				        type: this.type,
				        page_no: this.pageNo, // 页码
				        page_size: 10, //条数
				    }
				}).then(data => {
				    //data为一个数组，数组第一项为错误信息，第二项为返回数据
				    that.loadModal = false;
				    var [error, res]  = data;
				    let response = JSON.parse(res.data);
				    if( response.code == "000000" ) {
				        that.data = [];
				        that.data = that.data.concat(response.data);
				        
				        if (that.data.length < 10) {
				            that.loadMoreText = "没有更多数据了!"
				            that.showLoadMore = true
				        } 
                        if (that.data.length == 0) {
                            that.showLoadMore = false
                        }
				        uni.stopPullDownRefresh();
				    }  else {

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
                    this.loadModal = false;
					console.log('request fail', err);
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
				}); 
			},
			setListData() {
				this.pageNo = this.pageNo + 1;
				this.LoadModal()
                var that = this;
				uni.request({
				    url: this.GLOBAL.GetBonusList_URL,
				    dataType: 'jsonp',
				    method: 'POST',
				    data: {
                        access_token:this.token,
				        type: this.type,
				        page_no: this.pageNo, // 页码
				        page_size: 10, //条数
				    }
				}).then(data => {
				    //data为一个数组，数组第一项为错误信息，第二项为返回数据
				    that.loadModal = false;
				    var [error, res]  = data;
				    console.log(res.data);
				    let response = JSON.parse(res.data);
				    if( response.code == "000000" ) {
				        if (response.data.length != 10) {
				            that.loadMoreText = "没有更多数据了!"
				            that.showLoadMore = true
				        } 
				        that.data = that.data.concat(response.data);
				        uni.stopPullDownRefresh();
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
			},
            gotoRequest() {
                uni.navigateTo({
                    url:("./requestWithdraw?balance="+this.balance)
                })
            }
		},
        onLoad: function (option) {
            this.balance = option.balance;
        },
        onUnload() {
        	this.max = 0,
        	this.data = [],
        	this.loadMoreText = "加载更多",
        	this.showLoadMore = false;
        },
        onShow() {
            this.getUserInfo();
        },
        onReachBottom() {
        	console.log("onReachBottom");
        	if (this.loadMoreText == "没有更多数据了!") {
        		return;
        	}
        	this.showLoadMore = true;
        	setTimeout(() => {
        		this.setListData();
        	}, 300);
        },
        onPullDownRefresh() {
            this.pageNo = 1;
            this.loadMoreText= "加载中..."
            this.showLoadMore= false
            
        	console.log('onPullDownRefresh');
        	this.getUserInfo();
        },
	}
</script>

<style scoped>

    .top {
        height: 140rpx;
        background-image: linear-gradient(45deg, #0A98D5, #0A98D5);
        color: #ffffff;
        display: flex;
        flex-direction: row;
        
    }
    .topLeft {
        flex: 0.6;
        display: flex;
        align-items: center;
        justify-content : center;
        font-size: 40rpx;
    }
    .topRight {
        flex: 0.4;
        display: flex;
        align-items: center;
        justify-content : flex-end;
        margin-right: 30px;
        
    }
    .cu-btn {
        color: #0A98D5;
        padding: 24rpx;
        font-size: 28rpx;
    }
    
    
    .bottom {
        height: 100rpx;
        display: flex;
        flex-direction: row;
    }
    .bottomLeft {
        flex: 0.33;
        display: flex;
        align-items: center;
        justify-content : center;
        font-size: 38rpx;
    }
    .bottomCenter {
        flex: 0.33;
        display: flex;
        align-items: center;
        justify-content : center;
        font-size: 38rpx;
    }
    .bottomRight {
        flex: 0.33;
        display: flex;
        align-items: center;
        justify-content : center;
    }
    p {
        font-size: 48rpx;
    }
    
    .img {
        width: 52rpx;
        height: 52rpx;
    }
    .rightArrow {
        width: 22rpx;
        height: 12rpx;
        margin-left: 10rpx;
    }
    .empty {
        height: 400rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }
    .emptyImg {
        margin-top: 20px;
        width: 106px;
        height: 112px;
    }
    .emptyLabel {
        margin-top: 20px;
        text-align: center;
        color: #666666;
    }
    .itemBar {
        display: flex;
        position: relative;
        align-items: center;
        min-height: 100upx;
        justify-content: center;
        border-radius: 10px;
    }
    
    .itemBarALL {
        display: flex;
        position: relative;
        align-items: center;
        min-height: 100upx;
        justify-content: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    },
    .itemBarSend {
        display: flex;
        position: relative;
        align-items: center;
        min-height: 100upx;
        justify-content: center;
    },
    .itemBarReceive {
        display: flex;
        position: relative;
        align-items: center;
        min-height: 100upx;
        justify-content: center;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    },
    .itemcontent {
        width: 100%;
        padding: 5px;
        font-size: 32rpx;
    }
    .logout {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin-left: auto;
        margin-right: auto;
        width: 680upx;
        max-width: 100%;
        background-color: unset;
        border-radius: 10upx;
        overflow: hidden;
    }
    .line-h {
        height: 1px;
        width: 100%;
        background-color: #f0f0f0;
    }
</style>
