<template>
	<view>
		<view v-if="data.length==0" class="empty">
		    <image src="/static/empty.png" class="emptyImg"></image>
		    <view class="emptyLabel">
		        空空如也<br>
		    </view>
		</view>
		
		<view>
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
			onUnload() {
				this.max = 0,
				this.data = [],
				this.loadMoreText = "加载更多",
				this.showLoadMore = false;
			},
			onShow() {
			    this.initData();
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
				this.initData();
			},
		}
	}
</script>

<style>
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
</style>
